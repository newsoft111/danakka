import {postData, getData} from '../util/Api'

interface UserTicketCount {
	ticket_count: number;
}

class TicketManager {
	async getUserTicketCount() {
		const headers = {
			'Authorization': localStorage.getItem('accessToken')
		};

		try {
			const data = await getData<UserTicketCount>('/api/ticket/user/ticket-count/', {}, headers);

			if (data) {
				return data.ticket_count;
			} else {
				return null;
			}
		} catch (error) {
			console.log('토큰이 유효하지 않습니다.');
			return null;
		}
	}
}

export default new TicketManager();