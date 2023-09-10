import asyncio
#from booking.crawler.actions import BookingCrawlerAction

class Sunsang24Crawler:
	def __init__(self):
		self.value = 0

	async def run_main(self):
		while True:
			await asyncio.sleep(1)
			self.value += 1
			print(self.value)


