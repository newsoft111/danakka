import {
	Link,
	useColorModeValue,
	Text,
	HStack  
} from '@chakra-ui/react';
import NextLink from 'next/link'


interface NavItem {
	label: string;
	href: string;
}

const MyPageNavLink = ({ label, href }: NavItem) => {
	const linkColor = useColorModeValue('gray.600', 'gray.200');
	const linkHoverColor = useColorModeValue('gray.800', 'white');
	
	return (
		<Link
			as={NextLink}
			href={href}
			p={2}
			fontSize={'sm'}
			fontWeight={500}
			color={linkColor}
			_hover={{
				textDecoration: 'none',
				color: linkHoverColor,
			}}
		>
			<Text fontWeight={600}>{label}</Text>
		</Link>
	);
};

export default MyPageNavLink;