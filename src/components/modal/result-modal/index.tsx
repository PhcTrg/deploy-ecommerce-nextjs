"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import Image from "next/image";

// To manage this model, use the hook useDisclosure() from "@nextui-org/react"
const ResultModal: React.FC<IResultModal> = ({
  isOpen,
  onOpenChange,
  isSuccess,
  successContent,
  onAction,
}) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-80">
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col items-center gap-2 mt-8">
                  {isSuccess ? (
                    <Image
                      src={"/check.png"}
                      alt="check-icon"
                      width={45}
                      height={45}
                    />
                  ) : (
                    <Image
                      src={"/failed.png"}
                      alt="failed-icon"
                      width={45}
                      height={45}
                    />
                  )}

                  <h3 className="font-bold text-2xl my-2">
                    {isSuccess ? "Success" : "Error"}
                  </h3>
                  <div className="mb-2 text-center">
                    {isSuccess
                      ? successContent
                      : "Something went wrong. Please try again later."}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}

                <div className="w-full">
                  <Button
                    color={isSuccess ? "success" : "danger"}
                    onPress={() => {
                      if (onAction) {
                        onAction();
                      }
                      onClose();
                    }}
                    className="w-full"
                  >
                    OK
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ResultModal;
