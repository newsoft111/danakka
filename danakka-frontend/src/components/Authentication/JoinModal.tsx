import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLoginModal: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  openLoginModal,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleJoin = async () => {
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
		const response = await axios.post("/api/auth/join/", {
			email: email,
			password: password,
			password_check: passwordCheck,
		});
		  

      console.log(response.data); // 가입 완료 메시지 출력 또는 다른 처리

      // 가입 성공 후 추가적인 작업을 수행할 수 있습니다.

      // 예를 들어, 로그인 모달로 전환하는 등의 동작을 수행할 수 있습니다.
    } catch (error: any) {
      console.error(error.response.data); // 에러 메시지 출력 또는 에러 처리
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원가입</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>


          <FormControl mt={4}>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={openLoginModal} mr={3}>
            돌아가기
          </Button>
          <Button colorScheme="blue" onClick={handleJoin}>
            완료
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinModal;
