# Memos

## 메모 생성

> POST: http://10.36.10.93:80/api/memos

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - body
    | key    | type   | example | description |
    | ------ | ------ | ------- | ----------- |
    | memo\* | string | “memo1” |             |
- response
  - success(200)
    ```jsx
    {
    	"message": "Send Success"
    }
    ```
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "memo must be a string"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "memo is required"
    }
    ```

## 회원별 메모 목록 조회

> GET: http://10.36.10.93:80/api/memos

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
- response
  - success(200)
    ```jsx
    {
    	"memos": [
    		{
    			"user_id": string,
    			"create_date": Date,
    			"memo": string
    		}
    	]
    }
    ```
