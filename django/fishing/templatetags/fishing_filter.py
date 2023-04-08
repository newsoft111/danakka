from datetime import datetime, timedelta, date
from django import template
from korean_lunar_calendar import KoreanLunarCalendar

register = template.Library()

@register.simple_tag
def tomorrow(format):
    tomorrow = datetime.today() + timedelta(days=1)
    return tomorrow.strftime(format)


@register.filter
def convert_str_date(value):
    return str(datetime.strptime(value, '%Y-%m-%d').date())

@register.filter
def get_day_of_week(date):
	dateDict = {0: '월요일', 1:'화요일', 2:'수요일', 3:'목요일', 4:'금요일', 5:'토요일', 6:'일요일'}
	return f'{date.strftime("%Y년 %m월 %d일")} {dateDict[date.weekday()]}'


@register.filter
def get_tidal_strength(value):
	if False:
		#여기서 넘어온 date 는 day 임
		value = datetime.strptime(f"{date}-{value}", "%Y-%m-%d")
	calenter = KoreanLunarCalendar()
	calenter.setSolarDate(value.year, value.month, value.day)
	
	lunar_day = calenter.LunarIsoFormat()
	lunar_day = lunar_day.split(' ')[0]
	lunar_day = int(lunar_day.split('-')[-1])

	lunar_day += 6

	if lunar_day >= 30:
		lunar_day = lunar_day-30
	elif lunar_day >= 15:
		lunar_day = lunar_day-15
	
	if lunar_day == 14:
		return "조금"
	if lunar_day == 15 or lunar_day == 0:
		return '무시'

	return f"{lunar_day}물"

