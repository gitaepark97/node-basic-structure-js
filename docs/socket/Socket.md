# Socket

##

<aside>
💡 접속

http://10.36.10.93:80

```jsx
{
	"query": {
		"user_id": string
	},
	"transports": ["websocket"],
	"path": "/socket.io",
	"forceNew": false
}
```

</aside>

> LISTEN: CREATE_MEMO

- 메모 생성 시 생성한 회원의 메모 목록을 전달합니다
- response
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
