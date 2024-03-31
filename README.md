# ClassTing Homework API  

> 클래스팅 과제 제출을 위한 문서 입니다.  

## 사용 된 기술  

<div>
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
</div>  
<div>  
    <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"> <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
</div>  
<div>  
  <img src="https://img.shields.io/badge/Nestia-E0234E?style=flat-square"> <img src="https://img.shields.io/badge/Typia-critical?style=flat-square">
</div>  


## 테스트를 위한 환경 세팅  

1. [시드 데이터](#시드-데이터-사용)  
2. [문서화](#스웨거)  

## 테스트를 위한 방법  

> 해당 레포지토리를 원하시는 폴더에 클론 해주신 다음 진행 해주시면 됩니다.  

1. [일반 사용](#일반-테스트-환경)  
2. [도커 사용](#도커-테스트-환경)  


## 일반 테스트 환경  

### DB 설치  

Postgresql을 사용한 환경으로 구성되어 있어, 오류 발생을 줄이기 위해 해당 DB를 설치해주세요.  

다른 DB를 사용 하신다면 별도의 마이그레이션이 필요합니다.  

### 환경변수  

.env 파일은 별도로 올리지 않았습니다.  
클론으로 받으신 폴더에 환경변수 파일을 만들어 다음과 같은 양식으로 변수를 하나 만들어 주세요.  
(괄호는 빼고 기입해주세요.)  

**DATABASE_URL="postgresql://{db_user}:{db_password}@{host}:5432/classting?schema=public"**  

DB를 classting이 아닌 새로 만든 DB로 지정하여도 상관은 없습니다.  

### 종속성 모듈 설치  

다음 명령어로 종속성 모듈을 받아주세요.  

```
npm run install  
```  

### 실행  

다음 명령어 들로 기능을 테스트 해보실 수 있습니다.  

```
npm run test // 작성된 Unit test를 실행하고 결과를 표시 합니다.  
npm run start // 서버를 직접 실행해 실제환경 테스트를 해보실 수 있습니다.
```  

## 도커 테스트 환경  

### 도커 설치  

도커가 컴퓨터에 설치되어 있지 않으시다면 설치해주셔야 합니다.  

### 환경변수  

환경변수들이 존재하는데 수정을 하셔도, 하지 않으셔도 상관은 없습니다.  

> /prisma/Dockerfile  

**POSTGRES_USER=db_user**  
**POSTGRES_PASSWORD=db_password**  

> /Dockerfile  

**DATABASE_URL="postgresql://{db_user}:{db_password}@db:5432/classting?schema=public"**  
(도커에서 호스트는 db로 고정해주세요.)  

> /compose.yaml  

다음과 같은 명령어로 네트워크를 생성해 주시거나 따로 이미 설정한 네트워크가 존재 한다면 사용하실 네트워크로 이름만 바꿔주시면 됩니다.  

```
docker network create servernet  
```  

도커를 켜주시고 다음 명령어를 입력해주세요.  

```
docker-compose up  
```  

compose.yaml 파일에 기재되어 있지만 서버가 바로 구동되지는 않습니다.  
exec 명령어로 도커에 붙어서 실행 명령어를 입력 해주시거나 커맨드 부분에 적혀 있는 설명처럼 실행 명령어를 기입 해주시면 도커가 실행됨과 동시에 서버 또한 실행이 됩니다.  


## 시드 데이터 사용  

> /prisma/seed.ts  

몇 가지 편의성을 위해 넣어둔 시드 데이터 입력 방식을 넣어 보았습니다.  

각 함수별로 실행되는 명령이 다르며 커맨드 라인으로 처리 하려 하였으나 커맨드가 입력받아지지 않아 따로 사용하실 함수만 주석을 해제하셔서 사용해야 합니다.  

다음 명령어로 시드 데이터를 입력하실 수 있습니다.  

```
npx prisma db seed  
```  
어드민 생성, 유저 생성, 학교 페이지 생성, 학교 페이지 리셋 등이 있으며 어드민 생성은 시드를 통해 해주셔야 합니다.  

또한 학교 페이지는 함수에 직접 값을 입력하는 것과는 다르게 /prisma/seed.json 파일을 수정해주셔야 합니다.  
(기본값이 존재하니 그냥 사용하셔도 됩니다.)  

## 스웨거  

네스티아 모듈에서 제공하는 스웨거 작성 방식을 이용하여 문서화 하였습니다.  

서버 실행 시, 스웨거 웹 또한 같이 구동이 되며 다음 주소로 들어가셔서 확인 하실 수 있습니다.  

[API Document](http://localhost:80/api)  