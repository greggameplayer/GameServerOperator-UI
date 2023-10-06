import {Button} from "@nextui-org/button";
import {Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure} from "@nextui-org/modal";
import {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import AuthCode from "react-auth-code-input";

export default function TwoFactorModal({onChange, onClose}: {onChange: (value: string) => void, onClose: () => void}) {

    const [code, setCode] = useState<string>("");

    const onInputChange = (value: string) => {
        setCode(value);
    }
    const onValidate = () => {
        onChange(code);
    }
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {formatMessage} = useIntl();
    useEffect(() => {
            onOpen();
    }, [onOpen]);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} onClose={onClose} className="my-auto">
                <ModalContent>
                    {(onCloseInside) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{formatMessage({id: "twofactor.title"})}</ModalHeader>
                            <ModalBody>
                                <div className="flex">
                                    <AuthCode onChange={onInputChange} length={6} containerClassName="flex flex-row justify-center gap-2 mx-auto" inputClassName="w-8 h-8 md:w-10 md:h-10 rounded text-center border-2 border-default-200" />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onCloseInside}>
                                    {formatMessage({id: "twofactor.labels.close"})}
                                </Button>
                                <Button color="primary" onPress={() => {
                                    onValidate();
                                    onCloseInside();
                                }}>
                                    {formatMessage({id: "twofactor.labels.validate"})}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
