# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "my-todolist" [level=1] [ref=e5]
  - paragraph [ref=e6]: Simple To-do Management Service
  - heading "Register" [level=2] [ref=e7]
  - generic [ref=e8]: A server error occurred
  - generic [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]: Username
      - textbox "Username" [ref=e12]: error_test_1770944715603
    - generic [ref=e13]:
      - generic [ref=e14]: Password
      - textbox "Password" [ref=e15]: AnotherPass123!
    - generic [ref=e16]:
      - generic [ref=e17]: Email
      - textbox "Email" [ref=e18]: another_1770944715603@example.com
    - button "Register" [ref=e19] [cursor=pointer]
    - paragraph [ref=e20]:
      - text: Login?
      - link "Login" [ref=e21] [cursor=pointer]:
        - /url: /login
```