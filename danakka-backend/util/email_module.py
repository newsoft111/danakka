from smtplib import SMTP_SSL


class EmailSender:
	def __init__(self, toEmail, title, content):
		self.toEmail = toEmail
		self.title = title
		self.content = content


	def daum(self):
		fromEmail = 'cornde@cornde.com'	 # 기본 발신자

		if self.toEmail:
			try:

				msg = "\r\n".join([
					"From: " + fromEmail,
					"To: " + self.toEmail,
					"Subject: " + self.title,
					"",
					self.content
				])

				## Daum SMTP
				conn = SMTP_SSL("smtp.daum.net:465")
				conn.ehlo()

				loginId = 'cornde'
				loginPassword = 'ehdwns2510123!@#'
				conn.login(loginId, loginPassword)

				conn.sendmail(fromEmail, self.toEmail, msg)
				conn.close()
				print('Success to send emails.') 
				return True


			except Exception as e:
				print(e)
				return False
		else:
			return False

