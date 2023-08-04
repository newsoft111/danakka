import {
	Card,
	Stack,
	Flex,
	CardBody, 
	Link,
	Container,
	Text,
	Grid,
	GridItem,
	HStack,
	Box,
	Hide,
	useColorModeValue
} from '@chakra-ui/react';
import ProfileCard from "./ProfileCard"
import NextLink from 'next/link'



const HorizontalMenu = () => {
	interface NavItem {
		label: string;
		href: string;
	}
	
	const NAV_ITEMS: Array<NavItem> = [
		{
			label: '대시보드',
			href: '/auth/mypage'
		},
		{
			label: '내프로필',
			href: '/auth/mypage/profile'
		},
		{
			label: '보안설정',
			href: '/auth/mypage/security'
		},
		{
			label: '티켓관리',
			href: '/auth/mypage/ticket'
		}
	];

	const linkColor = useColorModeValue('gray.600', 'gray.200');
	const linkHoverColor = useColorModeValue('gray.800', 'white');
  
	return (
	  	<HStack spacing={4} overflowX="auto">
			{NAV_ITEMS.map((navItem, index) => (

					<Link
						key={index}
						flexShrink="0"
						as={NextLink}
						href={navItem.href}
						p={2}
						fontSize={'sm'}
						fontWeight={500}
						color={linkColor}
						_hover={{
							textDecoration: 'none',
							color: linkHoverColor,
						}}
					>
						<Text fontWeight={600}>{navItem.label}</Text>
					</Link>

			))}
	  	</HStack>
	);
};


const MyPageNavBar = ({ children }: { children: React.ReactNode }) => {
	return (
		<Container m={0} mx="auto" p={0} maxW='560px'>
			<Card mb={4}>
				<CardBody>
					<Flex>
						<HorizontalMenu/>
					</Flex >
				</CardBody>
			</Card>
			
			{children}
				
		</Container>
		
	)
  };


export default MyPageNavBar;