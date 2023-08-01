import requests
from pushbullet import Pushbullet
class SmsSender:
	def __init__(self, phone_number, message_type, content):
		self.phone_number = "0082" + phone_number[1:]
		self.content = content
		self.message_type = message_type

	def ifttt(self):
		if self.phone_number:
			url = 'https://maker.ifttt.com/trigger/danakka/with/key/dcU1Ycar8uBl6qGS_LJNyF'

			data = {
					'value1':self.phone_number,
					'value2':self.content
			}

			try:
				response = requests.post(url, data=data)

				if response.status_code == 200:
					# 성공적으로 요청을 보냈을 경우
					return True
				else:
					# 요청이 실패한 경우 (오류 처리 필요)
					return False
			except requests.RequestException:
				# 네트워크 오류 등 예외 처리
				return False
		else:
			return False
		

	def pushbullet(self):
		if self.phone_number:
			api_key = 'o.kxzQIHToeToyMmYbK6vVcknXi6IAi4l5'
			pb = Pushbullet(api_key)
			try:

				device = pb.devices[0] #디바이스 설정
				pb.push_sms(device, self.phone_number, self.content)
				return True

			except:
				
				return False
		else:
			return False