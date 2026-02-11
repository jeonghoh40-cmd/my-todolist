# My-Todolist API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Error Codes
| Code | Message | Description |
|------|---------|-------------|
| E-001 | Username already exists | When registering with an existing username |
| E-002 | Invalid credentials | When login credentials are incorrect |
| E-003 | Invalid email format | When email format is invalid |
| E-004 | Username, password, and email are required | When required fields are missing during registration |
| E-101 | Authentication required | When authentication token is missing or invalid |
| E-102 | Access denied | When trying to access resources owned by another user |
| E-103 | Title is required | When creating/updating a todo without a title |
| E-104 | Todo not found | When trying to access a non-existent todo |

## Endpoints

### Authentication

#### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Success Response:**
- Status: 201 Created
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "createdAt": "timestamp"
  }
}
```

**Error Responses:**
- 400: E-004 (Required fields missing)
- 409: E-001 (Username already exists)
- 400: E-003 (Invalid email format)

#### POST /auth/login
Login with existing credentials

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:**
- Status: 200 OK
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "createdAt": "timestamp"
  },
  "token": "jwt_token_string"
}
```

**Error Responses:**
- 401: E-002 (Invalid credentials)

### Todos

#### GET /todos
Get all todos for the authenticated user

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
- Status: 200 OK
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Sample Todo",
    "description": "Description of the todo",
    "due_date": "2026-12-31",
    "is_completed": false,
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

**Error Responses:**
- 401: E-101 (Authentication required)

#### POST /todos
Create a new todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "dueDate": "YYYY-MM-DD (optional)"
}
```

**Success Response:**
- Status: 201 Created
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Sample Todo",
  "description": "Description of the todo",
  "due_date": "2026-12-31",
  "is_completed": false,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Error Responses:**
- 401: E-101 (Authentication required)
- 400: E-103 (Title is required)

#### PUT /todos/:id
Update an existing todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "dueDate": "YYYY-MM-DD (optional)"
}
```

**Success Response:**
- Status: 200 OK
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated Todo",
  "description": "Updated description",
  "due_date": "2026-12-31",
  "is_completed": false,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Error Responses:**
- 401: E-101 (Authentication required)
- 403: E-102 (Access denied)
- 404: E-104 (Todo not found)
- 400: E-103 (Title is required)

#### DELETE /todos/:id
Delete a todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
- Status: 204 No Content

**Error Responses:**
- 401: E-101 (Authentication required)
- 403: E-102 (Access denied)
- 404: E-104 (Todo not found)

#### PATCH /todos/:id/complete
Toggle the completion status of a todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
- Status: 200 OK
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Sample Todo",
  "description": "Description of the todo",
  "due_date": "2026-12-31",
  "is_completed": true,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Error Responses:**
- 401: E-101 (Authentication required)
- 403: E-102 (Access denied)
- 404: E-104 (Todo not found)