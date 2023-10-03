# python 버전 or latest 입력
FROM python:3.11.0

ENV PYTHONUNBUFFERED 1

RUN apt-get -y update
RUN apt-get -y install vim

#RUN apt-get install git -y

RUN mkdir /var/fastapi
ADD . /var/fastapi

WORKDIR /var/fastapi

RUN pip install --upgrade pip
RUN pip install python-dateutil
RUN pip install poetry
RUN poetry export -f requirements.txt > requirements.txt
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
