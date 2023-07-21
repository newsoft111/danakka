import {
	StackDivider,
	Flex,
	Text,
	CardBody,
	VStack,
	useColorModeValue,
	Link
} from '@chakra-ui/react';
import NextLink from 'next/link'


interface NavItem {
	label: string;
	href: string;
}



const MyPageDesktopNav = ({ label, href }: NavItem) => {
	const linkColor = useColorModeValue('gray.600', 'gray.200');
	const linkHoverColor = useColorModeValue('gray.800', 'white');

	
	return (
		<VStack
  			align='stretch'
		>
			<Link
			as={NextLink}
			href={href}
			my={2}
			color={linkColor}
			_hover={{
				textDecoration: 'none',
				color: linkHoverColor,
			}}
			>
				<Text fontWeight={600}>{label}</Text>
			</Link>
		</VStack>		
	);
};

export default MyPageDesktopNav;