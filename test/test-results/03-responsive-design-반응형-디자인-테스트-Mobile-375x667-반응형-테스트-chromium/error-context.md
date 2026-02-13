# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading "My Todo List" [level=1] [ref=e6]
      - generic [ref=e7]:
        - generic [ref=e8]: responsive_1770944739198, Hello
        - combobox [ref=e9] [cursor=pointer]:
          - option "한국어"
          - option "English" [selected]
        - button "🌙" [ref=e10] [cursor=pointer]
        - button "Logout" [ref=e11] [cursor=pointer]
  - main [ref=e12]:
    - button "+ Add Todo" [ref=e13] [cursor=pointer]:
      - generic [ref=e14]: +
      - text: Add Todo
    - generic [ref=e15]:
      - generic [ref=e16]: 📝
      - paragraph [ref=e17]: No todos yet.
      - paragraph [ref=e18]: Add a new todo!
  - generic [ref=e20]:
    - generic [ref=e21]:
      - heading "Add Todo" [level=2] [ref=e22]
      - button "×" [ref=e23] [cursor=pointer]
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]: Title *
        - textbox [active] [ref=e27]
      - generic [ref=e28]:
        - generic [ref=e29]: Description
        - textbox [ref=e30]
      - generic [ref=e31]:
        - generic [ref=e32]: Due Date
        - textbox [ref=e33]
      - generic [ref=e34]:
        - button "Cancel" [ref=e35] [cursor=pointer]
        - button "Save" [ref=e36] [cursor=pointer]
```