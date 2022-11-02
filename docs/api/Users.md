# Users

## 회원 목록 조회

> GET: http://10.36.10.93:80/api/users

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
- response
  - success(200)
    ```jsx
    {
    	"users": [
    		{
    			"id": string,
    			"email": string,
    			"name": string, // nullable
    			"create_date": Date,
    			"update_date": Date,
    			"delete_date": Date, // nullable
    			"image_url": Date, // nullable
    			"is_connect": number // 0(미접속), 1(접속)
    		}
    	]
    }
    ```

## id별 회원 조회

> GET: http://10.36.10.93:80/api/users/:id

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - path
    | key  | type   | example          | description |
    | ---- | ------ | ---------------- | ----------- |
    | id\* | string | “US103699794911” |             |
- response
  - success(200)
    ```jsx
    {
    	"user": {
    		"id": string,
    		"email": string,
    		"name": string, // nullable
    		"create_date": Date,
    		"update_date": Date,
    		"delete_date": Date, // nullable
    		"image_url": Date, // nullable
    		"is_connect": number // 0(미접속), 1(접속)
    	}
    }
    ```
  - not found(404)
    ```jsx
    {
    	"name": "Not Found",
    	"message": "user"
    }
    ```

## 회원 수정

> PUT: http://10.36.10.93:80/api/users/:id

- request
  - header
    | key             | type   | example                   | description            |
    | --------------- | ------ | ------------------------- | ---------------------- |
    | authorization\* | string | “Bearer eyJhbGciOiJIUzi…” | Bearer ${access_token} |
  - path
    | key  | type   | example          | description |
    | ---- | ------ | ---------------- | ----------- |
    | id\* | string | “US103699794911” |             |
- response
  - success(200)
  - bad request(400)
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "name must be a string"
    }
    ```
    ```jsx
    {
    	"name": "Bad Request",
    	"message": "user who has resigned"
    }
    ```
  - forbidden(403)
    ```jsx
    {
    	"name": "Forbidden",
    	"message": "only update your information"
    }
    ```
