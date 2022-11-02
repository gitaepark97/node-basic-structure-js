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
│ │ └── memos.dto.js // memos 관련 joi objectSchema
│ ├── events
│ │ └── memos.event.js // memos 관련 socket event
│ ├── exceptions
│ │ └── BadRequest.exception.js // 400 에러
│ ├── loaders
│ │ ├── kafka.loader.js // kafka 설정
│ │ ├── server.loader.js // 기본 express 설정(middleware)
│ │ └── socket.loader.js // socket server 설정
│ ├── middlewares
│ │ ├── debug.interceptor.js // 개발 시 response 확인
│ │ ├── error.interceptor.js // 에러 확인 및 response 전달
│ │ └── validateSocket.pipe.js // joi를 이용한 socket data 검사
│ ├── utils
│ │ └── logger.util.js // logger 함수 및 winston 설정
│ ├── api.worker.js // 시작 파일
│ └── ecosystem.config.js // pm2 설정 및 env 설정값
├── .eslintrc.js // eslint 설정
├── .prettierrc // prettier 설정
├── Dockerfile
├── nodemon.json // nodemon 설정 파일
├── package-lock.json
└── package.json
```
