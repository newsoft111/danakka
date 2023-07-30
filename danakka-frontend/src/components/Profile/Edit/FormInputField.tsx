import { 
	FormControl, 
	Flex, 
	FormLabel, 
	InputGroup, 
	Input, 
	InputRightElement, 
	Button,
	Text
} from '@chakra-ui/react';

interface ProfileEditFormInputFieldProps {
  label: string;
  value: string;
  handleOnClick: () => void;
  isReadOnly?: boolean;
  handleonChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEditFormInputField: React.FC<ProfileEditFormInputFieldProps> = ({ label, value, handleOnClick, isReadOnly=false, handleonChange }) => {

  return (
    <FormControl mt={5}>
      <Flex alignItems={{ base: "flex-start", lg: "center" }} direction={{ base: "column", lg: "row" }}>
        <FormLabel flexShrink="0" m={0} width={{ base: "100%", lg: "150px" }}>{label}</FormLabel>
        <InputGroup size='md' mt={{ base: 2, lg: 0 }}>
          <Input
            pr='4.5rem'
            value={value}
            isReadOnly={isReadOnly}
            onChange={handleonChange}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleOnClick}><Text>수정</Text></Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </FormControl>
  );
};

export default ProfileEditFormInputField;
