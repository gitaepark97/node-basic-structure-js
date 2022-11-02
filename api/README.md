## 폴더 구조

```
.
├── logs
│ └── debug // 운영 시 디버그 로그 파일, 최대 7일 보관
│ └── error // 운영 시 에러 로그 파일, 최대 7일 보관
├── node_modules
├── src
│ ├── config
│ │ └── index.js // 설정값
│ ├── dtos
│ │ ├── auth.dto.js // auth 관련 joi objectSchema
│ │ ├── memos.dto.js // memos 관련 joi objectSchema
│ │ ├── tasks.dto.js // tasks 관련 joi objectSchema
│ │ └── users.dto.js // users 관련 joi objectSchema
│ ├── exceptions
│ │ ├── BadRequest.exception.js // 400 에러
│ │ ├── Forbidden.exception.js // 403 에러
│ │ ├── InternalServer.exception.js // 500 에러
│ │ └── NotFound.exception.js // 404 에러
│ ├── loaders
│ │ ├── kafka.loader.js // kafka 설정
│ │ └── server.loader.js // 기본 express 설정(routing, middleware)
│ ├── middlewares
│ │ ├── auth.guard.js // access_token 인가
│ │ ├── debug.interceptor.js // 개발 시 response 확인
│ │ ├── error.interceptor.js // 에러 확인 및 response 전달
│ │ ├── upload.middleware.js // s3 업로드
│ │ └── validateBody.pipe.js // joi를 이용한 request body 검사
│ ├── repositories
│ │ ├── base
│ │ │ ├── nosql.repository.js // 기본 nosql query 전송 로직
│ │ │ └── rdbms.repository.js // 기본 rdbms query 전송 로직
│ │ ├── auth.repository.js // refresh_tokens 관련 query
│ │ ├── memos.repository.js // memos 관련 query
│ │ ├── tasks.repository.js // tasks 관련 query
│ │ └── users.repository.js // users 관련 query
│ ├── routers
│ │ ├── auth.router.js // auth 관련 api 주소
│ │ ├── memos.router.js // memos 관련 api 주소
│ │ ├── tasks.router.js // tasks 관련 api 주소
│ │ └── users.router.js // users 관련 api 주소
│ ├── services
│ │ ├── auth.service.js // auth 로직 구현부
│ │ ├── memos.service.js // memos 로직 구현부
│ │ ├── tasks.service.js // tasks 로직 구현부
│ │ └── users.service.js // users 로직 구현부
│ ├── utils
│ │ ├── logger.util.js // logger 함수 및 winston 설정
│ │ ├── password.util.js // 패스워드 관련 함수
│ │ └── token.util.js // 토큰 관련 함수
│ ├── api.worker.js // 시작 파일
│ ├── container.js // di container
│ └── ecosystem.config.js // pm2 설정 및 env 설정값
├── test
│ ├── dtos
│ │ ├── auth.dto.test.js // auth 테스트 케이스
│ │ ├── memos.dto.test.js // memos 테스트 케이스
│ │ ├── tasks.dto.test.js // tasks 테스트 케이스
│ │ └── users.dto.test.js // users 테스트 케이스
│ ├── e2e
│ │ ├── auth.test.js // auth e2e 테스트 코드
│ │ ├── memos.test.js // memos e2e 테스트 코드
│ │ ├── tasks.test.js // tasks e2e 테스트 코드
│ │ └── users.test.js // users e2e 테스트 코드
│ ├── repositories
│ │ ├── base
│ │ │ └── rdbms.repository.test.js // rdms repository mock
│ │ ├── auth.repository.test.js // auth repository mock
│ │ ├── memos.repository.test.js // memos repository mock
│ │ ├── tasks.repository.test.js // tasks repository mock
│ │ └── users.repository.test.js // users repository mock
│ └── services
│ │ ├── auth.service.test.js // auth service 테스트 코드
│ │ ├── memos.service.test.js // memos service 테스트 코드
│ │ ├── tasks.service.test.js // tasks service 테스트 코드
│ │ └── users.service.test.js // users service 테스트 코드
│ └── container.test.js // 테스트 di container
├── .eslintrc.js // eslint 설정
├── .prettierrc // prettier 설정
├── Dockerfile // docker build file
├── README.md
├── jest-e2e.config.js // e2e 테스트 jest 설정 파일
├── jest.config.js // jest 설정 파일
├── nodemon.json // nodemon 설정 파일
├── package-lock.json
└── package.json
```
