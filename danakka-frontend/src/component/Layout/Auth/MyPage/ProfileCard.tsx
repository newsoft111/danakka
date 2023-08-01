import {
	Heading,
	Avatar,
	Card,
	CardBody,
	CardHeader,
	Text,
	Center,
	
  } from '@chakra-ui/react';

const ProfileCard = () => {
	return (
		<Card align='center'>
			<CardHeader>
				<Avatar
					size={'xl'}
					src={
						'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
					}
					_after={{
						content: '""',
						w: 4,
						h: 4,
						bg: 'green.300',
						border: '2px solid white',
						rounded: 'full',
						pos: 'absolute',
						bottom: 0,
						right: 3,
					}}
				/>

			</CardHeader>
			<CardBody>
				<Center>
					<Heading fontSize={'2xl'} fontFamily={'body'}>
						Lindsey James
					</Heading>
				</Center>
				<Center>
					<Text fontWeight={600} color={'gray.500'} mb={4}>
						@lindsey_jam3s
					</Text>		
				</Center>
			</CardBody>
      </Card>
	)
}

export default ProfileCard;