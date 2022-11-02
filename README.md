## 폴더 구조

```
.
├── api // rest api 서버
├── docker
├── nosql
│ ├── db // nosql 정보
│ └── initdb
│ │ └── init.sh // keyspace 및 table 생성 query
├── proxy
│ ├── Dockerfile
│ └── nginx.conf // nginx 기본 설정 파일
└── rdbms
│ ├── config
│ │ └── my.cnf // 기본 설정 파일
│ ├── db // rdbms 정보
│ └── initdb
│ │ ├── create_database.sql // test database 생성 query
│ │ ├── create_table_refresh_token.sql // refresh_tokens table 생성 query
│ │ └── create_table_user.sql // users table 생성 query
├── socket // socket 서버
├── .gitignore
├── docker-compose.dev.yml // development docker compose 설정
├── docker-compose.dev.yml // development docker compose 설정
├── docker-compose.prod.yml // production docker compose 설정
├── docker-compose.yml // 기본 docker compose 설정
├── init.sh // 실행 명령어
└── README.md
```

---

## 명령어

- 실행 명령어

  - environment: prod/dev
  - build: y/n

  ```
  sh init.sh
  ```

- 종료 명령어

  ```
  docker-compose down
  ```
