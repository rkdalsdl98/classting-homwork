FROM node:20

WORKDIR /usr/src/app/

RUN apt-get update; \
		apt-get install -y apt-utils redis-server nano curl git locales;

# 언어 추가
RUN localedef -i ko_KR -f UTF-8 ko_KR.UTF-8
RUN localedef -i en_US -f UTF-8 en_US.UTF-8
ENV LANG en_US.utf8

# 깃 설정 값

RUN git config --global user.name git-username
RUN git config --global user.email git-useremail

RUN git init
RUN git remote add origin https://github.com/rkdalsdl98/classting-homwork.git
RUN git clone https://github.com/rkdalsdl98/classting-homwork.git

# 서버 환경 변수

ENV DATABASE_URL="postgresql://postgres:{password}@localhost:5432/classting?schema=public"



# 컨테이너 로드 중 실행 될 기타 명령어

RUN npm install
RUN npm run build

RUN npx prisma generate
