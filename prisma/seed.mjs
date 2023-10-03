import {PrismaClient, PermissionType, PermissionGroup} from '@prisma/client';
import {PrismaAdapter} from "@auth/prisma-adapter";
import {hash} from "bcrypt";

const prisma = new PrismaClient();

const adapter = PrismaAdapter(prisma);


const basicPermissions = async () => {
    const permissionsTab = [
        {name: "all:admin:manage_users", type: [PermissionType.ALL], group: PermissionGroup.ADMIN, gameId: null},
        {name: "all:admin:manage_permissions", type: [PermissionType.ALL], group: PermissionGroup.ADMIN, gameId: null},
        {name: "all:admin:manage_groups", type: [PermissionType.ALL], group: PermissionGroup.ADMIN, gameId: null},
    ];

    await prisma.$transaction(permissionsTab.map((permission) => {
        return prisma.permission.upsert({
            where: {
                name: permission.name
            },
            update: {},
            create: permission
        });
    }));
}

const basicGroups = async () => {
    const groupsTab = [
        {
            name: "admin",
            permissions: ["all:admin:manage_users", "all:admin:manage_permissions", "all:admin:manage_groups"]
        },
    ];

    await prisma.$transaction(groupsTab.map((group) => {
        return prisma.group.upsert({
            where: {
                name: group.name
            },
            update: {},
            create: {
                name: group.name,
                permissions: {
                    connect: group.permissions.map((permission) => {
                        return {
                            name: permission
                        }
                    })
                }
            }
        });
    }));
}

export async function main() {
    if (!process.env.DEFAULT_USER_EMAIL || !process.env.DEFAULT_USER_PASSWORD) {
        console.error("No default user email or password set. Please set the DEFAULT_USER_EMAIL and DEFAULT_USER_PASSWORD environment variables.");
        process.exit(1);
    }

    await basicPermissions();

    await basicGroups();

    const defaultUser = await prisma.user.findFirst({
        where: {
            email: process.env.DEFAULT_USER_EMAIL
        }
    });

    if (defaultUser) {
        console.log("Default user already exists. Skipping creation.");
        return;
    }

    const user = await adapter.createUser({
        name: "Default",
        email: process.env.DEFAULT_USER_EMAIL,
        emailVerified: new Date()
    });

    const adapterAccount = {
        id: "1",
        type: "email",
        providerAccountId: process.env.DEFAULT_USER_EMAIL,
        userId: user.id,
        provider: "credentials",
    }

    await adapter.linkAccount(adapterAccount);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: await hash(atob(process.env.DEFAULT_USER_PASSWORD), 10),
            // affect the user to the admin group by the permissions
            permissions: {
                connect: await prisma.permission.findMany({
                    where: {
                        group: PermissionGroup.ADMIN
                    },
                    select: {
                        name: true
                    }
                })
            }
        }
    });


}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
