# USER API SPECS

## Features

- register
- login
- get users
- get user by username
- verify / activation / recover account
- forgot password
- change password
- request to become Event Organizer
- logout account

---
### Register User

Endpoint : POST /api/users

##### Request Body Form Data:

```json
{
  "username": "",
  "email": "",
  "password": "",
  "avatar_url": "", // optional
  "display_name": "", // optional || default username
  "referral_code": "" // optional
}
```

##### Response Body (success) :

```json

  {
    "status": "OK",
    "user": {
      "id": "",
      "username": "",
      "email": "",
      "avatar_url": "",
      "display_name": "",
      "referral_code": "",
      "is_verified": false,
      "role": "USER",
      "status": "ACTIVE",
      "points": 0,
      "points_expired_at": 0,
      "updated_at": "",
      "created_at": "",
    },
    "token": ""
  }

```

##### Response Body (Failed) :

```json

  {
    "status": "Not OK",
    "errors": "email or username already used!"
  }

```



---
### Login User

Endpoint : POST /api/users/login

##### Request Body Form Data:

```json
{
  "data": "", // this could be email or username
  "password": ""
}
```

##### Response Body (success):

```json
{
  "status": "OK",
  "user": {
    "id": "",
    "username": "",
    "email": "",
    "avatar_url": "",
    "display_name": "",
    "referral_code": "",
    "is_verified": false,
    "role": "USER",
    "status": "ACTIVE",
    "points": 0,
    "points_expired_at": 0,
    "updated_at": "",
    "created_at": ""
  },
    "token": ""
}
```

##### Response Body (failed):

```json
{
  "status": "Not OK",
  "errors": "Invalid email or username!"
}
```


---
### Get Users
Endpoint GET /api/users?name=wethefest


---
### Get User by username
Endpoint GET /api/users/@wethefest


---
### Verify / Activation / Recover Account

Endpoint POST /api/users/activation/:userId/:activationCode

##### Response Body (success):


```json

  {
    "status": "OK",
    "message": "User account activated successfully."
  }

```

```json

  {
    "status": "OK",
    "message": "Your account is already active."
  }

```

##### Response Body (failed):


```json

  {
    "status": "Not OK",
    "message": "Unauthorized."
  }

```


---
### Forgot Password


---
### Forgot Password


---
### Change Password


---
### Request Event Organization Role
