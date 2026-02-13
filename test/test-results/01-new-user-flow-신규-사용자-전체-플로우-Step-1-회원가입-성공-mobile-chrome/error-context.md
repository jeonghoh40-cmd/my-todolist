# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "my-todolist" [level=1] [ref=e5]
  - paragraph [ref=e6]: Simple To-do Management Service
  - heading "Register" [level=2] [ref=e7]
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: Username
      - textbox "Username" [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]: Password
      - textbox "Password" [ref=e14]
    - generic [ref=e15]:
      - generic [ref=e16]: Email
      - textbox "Email" [ref=e17]
    - button "Register" [ref=e18] [cursor=pointer]
    - paragraph [ref=e19]:
      - text: Login?
      - link "Login" [ref=e20] [cursor=pointer]:
        - /url: /login
```