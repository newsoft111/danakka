import {
	Card,
	Center,
	Heading,
	CardBody, 
	Box,
	Stack,
	StackDivider,
	Text,
	Grid,
	GridItem,
	useMediaQuery,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Hide,
	Show
} from '@chakra-ui/react';
import MyPageMobileNav from "./MobileNav"
import MyPageDesktopNav from "./DesktopNav"
import ProfileCard from "./ProfileCard"

interface NavItem {
	label: string;
	href: string;
}

const NAV_ITEMS: Array<NavItem> = [
	{
		label: '대시보드',
		href: '/mypage'
	},
	{
		label: '내프로필',
		href: '/mypage/profile'
	},
	{
		label: '보안설정',
		href: '/mypage/security'
	},
	{
		label: '티켓관리',
		href: '/mypage/ticket'
	}
];


const MyPageNavBar = ({ children }: { children: React.ReactNode }) => {
	return (
		<Grid
			templateColumns={{ sm: "1fr", lg: "repeat(4, 1fr)" }}
			gap={4}
			>
			<GridItem colSpan={1}>
				<Show below='lg'>
					<Center>
						{NAV_ITEMS.map((navItem) => (
							<MyPageMobileNav key={navItem.label} {...navItem}/>
						))}
					</Center>
				</Show>

				<Hide below='lg'>
					<ProfileCard/>
					<Card mt={4}>
						<CardBody>
							{NAV_ITEMS.map((navItem) => (
								<MyPageDesktopNav key={navItem.label} {...navItem}/>
							))}
						</CardBody>
					</Card>
				</Hide>

			</GridItem>

			<GridItem colSpan={3}>
				{children}
			</GridItem>
		</Grid>

		
	)
  };


export default MyPageNavBar;