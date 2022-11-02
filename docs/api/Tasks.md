# Tasks

## 다중 업무 생성

> POST: http://10.36.10.93:80/api/tasks

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - body
    | key      | type     | example           | description |
    | -------- | -------- | ----------------- | ----------- |
    | titles\* | string[] | [”task1”,“task2”] |             |
- response
  - success(200)
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "titles must be an array"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "titles is required"
    }
    ```

## 회원별 업무 목록 조회

> GET: http://10.36.10.93:80/api/tasks

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
- response
  - success(200)
    ```jsx
    {
    	"tasks": [
    		{
    			"id": string,
    			"user_id": string,
    			"title": string,
    			"is_done": number, // 0(미완료), 1(완료)
    			"create_date": Date,
    			"update_date": Date
    		}
    	]
    }
    ```

## id별 업무 조회

> GET: http://10.36.10.93:80/api/tasks/:id

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - path
    | key  | type   | example          | description |
    | ---- | ------ | ---------------- | ----------- |
    | id\* | string | “TK367281942995” |             |
- response
  - success(200)
    ```jsx
    {
    	"task": {
    		"id": string,
    		"user_id": string,
    		"title": string,
    		"is_done": number, // 0(미완료), 1(완료)
    		"create_date": Date,
    		"update_date": Date
    	}
    }
    ```
  - forbidden(403)
    ```jsx
    {
    	"name": "Forbidden",
    	"message": "only show your tasks"
    }
    ```
  - not found(404)
    ```jsx
    {
    	"name": "Not Found",
    	"message": "task"
    }
    ```

## 업무 수정

> PUT: http://10.36.10.93:80/api/tasks/:id

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - path
    | key  | type   | example          | description |
    | ---- | ------ | ---------------- | ----------- |
    | id\* | string | “TK367281942995” |             |
  - body
    | key     | type   | example | description |
    | ------- | ------ | ------- | ----------- |
    | title   | string | “task1” |             |
    | is_done | number | 1       |             |
- response
  - success(200)
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "title must be a string"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "is_done must be a number"
    }
    ```
  - forbidden(403)
    ```jsx
    {
    	"name": "Forbidden",
    	"message": "only update your tasks"
    }
    ```
