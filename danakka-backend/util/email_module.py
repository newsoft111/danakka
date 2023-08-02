from smtplib import SMTP_SSL
from email.mime.text import MIMEText

class EmailSender:
	def __init__(self, toEmail, title, content):
		msg = MIMEText(content, 'plain', 'utf-8')
		msg['Subject'] = title
		msg['To'] = toEmail

		self.msg = msg

		self.toEmail = toEmail
		self.title = title
		self.content = content


	def daum(self):
		fromEmail = 'cornde@cornde.com'	 # 기본 발신자
		self.msg['From'] = fromEmail
		if self.toEmail:
			try:

				## Daum SMTP
				conn = SMTP_SSL("smtp.daum.net:465")
				conn.ehlo()

				loginId = 'cornde'
				loginPassword = 'ehdwns2510123!@#'
				conn.login(loginId, loginPassword)

				conn.send_message(self.msg)
				conn.close()
				print('Success to send emails.') 
				return True


			except Exception as e:
				print(e)
				return False
		else:
			return False

