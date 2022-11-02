# API Docs

<aside>
💡 기본 정보

- token 유효기간 - access token: 1 day - refresh token: 2 weeks
</aside>

- 공통 에러
  - unauthorized(401)
    ```jsx
    {
    	"name": "Unauthorized",
    	"message": "access token empty"
    }
    ```
    ```jsx
    {
    	"name": "Unauthorized",
    	"message": "access token expired"
    }
    ```
    ```jsx
    {
    	"name": "Unauthorized",
    	"message": "access token invalid"
    }
    ```
  - internal server(500)
    ```jsx
    {
    	"name": "Internal Server"
    }
    ```

---

[Auth](api/Auth.md)

[Memos](api/Memos.md)

[Tasks](api/Tasks.md)

[Users](api/Users.md)

[Socket](socket/Socket.md)
