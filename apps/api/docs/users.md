# USER SPECS API

## Features

- [x] `public` register  
- [x] `public` login
- [x] `public` get users
- [x] `public` verify / activation / recover account
&nbsp;
- [x] `shared` get user by username
- [x] `shared` resend email verify
&nbsp;
- [x] `private` get user profile
- [x] `private` update profile
- [ ] `private` change email
- [x] `private` change password
- [x] `private` forgot password
- [x] `private` logout account
&nbsp;
- [ ] `private` request to become Event Organizer
&nbsp;
- [ ] `public` get temporal points by register code 
- [ ] `public` get discount voucher by successor from register account 
&nbsp;
- [ ] `public` 

---
### Register User

Endpoint : `POST` /api/users

##### Request Body Form Data:

```json
{
  "username": "",
  "email": "",
  "password": "",
  "avatar_url": "", // optional
  "display_name": "", // optional || default username
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

Endpoint : `POST` /api/users/login

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
Endpoint `GET` /api/users?name=wethefest


---
### Get User by username
Endpoint `GET` /api/users/@wethefest


---
### Verify / Activation / Recover Account

Endpoint `POST` /api/users/verify/:token

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


---
### Verify / Activation / Recover Account

Endpoint `POST` /api/users/verify/resend

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
### Change Password

---
### Forgot Password

Endpoint : `POST` /api/users/forgot

##### Request Body Form Data:

```json
{
  "email": ""
}
```


##### Response Body (success):


```json

  {
    "status": "OK",
    "message": "Check your email to reset your password."
  }

```

---
### Forgot Password


---
### Request Event Organization Role
