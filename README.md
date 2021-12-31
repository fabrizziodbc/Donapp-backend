# Donapp API

## Database Design

<img src="https://res.cloudinary.com/diyuywsuo/image/upload/v1640969221/database_diagram_syibcb.png">

## Endpoints API

### Authenticate

| Route        | Http Verb | Route Middleware | Description       |
|--------------|-----------|------------------|-------------------|
| /api/signin  | POST      |                  | Sign in an user   |
| /api/signup  | POST      |                  | Create a new user |
| /api/signout | POST      |                  | Close the session |

### Campaign

| Route                             | Http Verb | Route Middleware | Description                |
|-----------------------------------|-----------|------------------|----------------------------|
| /api/campaign                     | GET       |                  | List of all campaigns      |
| /api/campaign/:campaignId         | GET       |                  | Retrieve a campaign        |
| /api/campaign?category={category} | GET       |                  | List campaigns by category |
| /api/campaign                     | POST      |                  | Create a new campaign      |
| /api/campaign/:campaignId         | PUT       |                  | Update a campaign          |
| /api/campaign/:campaignId         | DELETE    |                  | Remove a campaign          |

### User

| Route                      | Http Verb | Route Middleware | Description               |
|----------------------------|-----------|------------------|---------------------------|
| /api/user/:userId/campaign | GET       | Authenticate()   | List of campaigns by user |

### HistoryPayment

| Route                   | Http Verb | Route Middleware | Description            |
|-------------------------|-----------|------------------|------------------------|
| /api/payment            | POST      | Authenticate()   | Create history payment |
| /api/payment/:paymentId | PUT       | Authenticate()   | Edit a history payment |