# Auth

## 회원가입

> POST: http://10.36.10.93:80/api/auth/register

- request
  - body
    | key        | type   | example         | description        |
    | ---------- | ------ | --------------- | ------------------ |
    | email\*    | string | “test@test.com” | 이메일 양식        |
    | password\* | string | “a1b2c3d4”      | 비밀번호(6~18자리) |
- response
  - success(200)
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email already used"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "password length must be at least 6 characters long"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "password length must be less than or equal to 18 characters long"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "password is required"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email must be a valid email"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email is required"
    }
    ```

## 로그인

> POST: http://10.36.10.93:80/api/auth/login

- request
  - body
    | key        | type   | example         | description |
    | ---------- | ------ | --------------- | ----------- |
    | email\*    | string | “test@test.com” | 이메일 양식 |
    | password\* | string | “a1b2c3d4”      | 비밀번호    |
- response
  - success(200)
    ```jsx
    {
    	"access_token": string,
    	"refresh_token": string
    }
    ```
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "wrong password"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "user who has resigned"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email must be a valid email"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email is required"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "password must be a string"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "password is required"
    }
    ```
  - not found(404)
    ```jsx
    {
    	"name": "Not Found",
    	"message": "user"
    }
    ```

## 회원 탈퇴

> DELETE: http://10.36.10.93:80/api/auth

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
- response
  - success(200)

## 회원 재가입

> POST: http://10.36.10.93:80/api/auth/re-register

- request
  - body
    | key     | type   | example         | description |
    | ------- | ------ | --------------- | ----------- |
    | email\* | string | “test@test.com” | 이메일 양식 |
- response
  - success(200)
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "user already register"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email must be a valid email"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "email is required"
    }
    ```
  - not found(404)
    ```jsx
    {
    	"name": "Not Found",
    	"message": "user"
    }
    ```

## refresh token으로 access token 재발급

> POST: http://10.36.10.93:80/api/auth/token

- request
  - body
    | key             | type   | example              | description |
    | --------------- | ------ | -------------------- | ----------- |
    | refresh_token\* | string | “eyJhbGciOiJIUzI1s…” |             |
- response
  - success(200)
    ```jsx
    {
    	"access_token": string,
    	"refresh_token": string
    }
    ```
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "wrong refresh_token or ip"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "refresh token expired"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "refresh_token must be a string"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "refresh_token is required"
    }
    ```
