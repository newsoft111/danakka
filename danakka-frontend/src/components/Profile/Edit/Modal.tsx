import { Modal as ChakraModal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import { useState } from "react";

interface ModalProps {
	field: string;
	onClose: () => void;
	onSave: () => void;
	children: React.ReactNode; // children 속성 추가
}

const ProfileEditModal: React.FC<ModalProps> = ({ field, onClose, onSave, children }) => {
  const handleSave = () => {
	onSave();
    onClose(); // 모달 닫기
  };

  return (
    <ChakraModal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>수정 - {field}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* 자식 컴포넌트로 전달된 내용을 표시합니다. */}
          {children}
        </ModalBody>
        <Button onClick={handleSave}>저장</Button>
      </ModalContent>
    </ChakraModal>
  );
};

export default ProfileEditModal;
