"use client"
import {
	Card,
	EditablePreview,
	CardBody, 
	Box,
	Divider ,
	Input,
	Editable,
	useEditableControls,
	ButtonGroup,
	IconButton,
	Flex,
	EditableInput
} from '@chakra-ui/react';
import MyPageNavBar from "../../../components/Layout/MyPage/NavBar"
import { CheckIcon, EditIcon, CloseIcon } from '@chakra-ui/icons'

const MyPageMyprofile = () => {
	const EditableControls = () => {
		const {
			isEditing,
			getSubmitButtonProps,
			getCancelButtonProps,
			getEditButtonProps,
		  } = useEditableControls()
	  
		  return isEditing ? (
			<ButtonGroup justifyContent='center' size='sm'>
			  <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
			  <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
			</ButtonGroup>
		  ) : (
			<Flex justifyContent='center'>
			  <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
			</Flex>
		  )

	}
	return (
		<MyPageNavBar>			
			<Card>
				<CardBody>
					<Editable
						textAlign='center'
						defaultValue='Rasengan ⚡️'
						fontSize='2xl'
						isPreviewFocusable={false}
						>
						<EditablePreview />
						{/* Here is the custom input */}
						<Input as={EditableInput} />
						<EditableControls />
					</Editable>
				</CardBody>
			</Card>
		</MyPageNavBar>
	)
}

export default MyPageMyprofile;