

# Forum Events

## [See the App!](https://forumevents.netlify.app/)

![App Logo](your-image-logo-path-or-name)

## Description

App designed to manage a space for events, fairs, congresses, etc.

**NOTE -** 
#### [Client Repo here](https://github.com/Mercedes-amor/forumEvents-Client)
#### [Server Repo here](https://github.com/Mercedes-amor/forumEvents)

## Backlog Functionalities

- Contact Form.
- 404 not found.
- Search events by month.
- Event history.
- Rate events.
- Comments section.
- Implement admin can see useres in events

## Technologies used

- JavaScript
- HTML
- CSS
- MongoDB
- Mongoose
- Cloudinary
- Bcryptjs
- Express
- Postman
- Cors
- Node
- Stripe
- React
- Axios
- Boostrap

# Server Structure

## Models

User model

```javascript
 {
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user"
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    eventsAsistance: [{
      type: Schema.Types.ObjectId,
      ref: "Event",
    }]
  },
```

Event model

```javascript
{

eventName: {
type: String,
required:true
},
startDate: {
    type: String,
    required:true
},
endDate:{
    type: String,
    required:true
},
itsFree: {
    type: Boolean,
    default: true,
    required:true
} ,
capacity: {
    type: Number,
    required:true
},
sector: {
    type: String,
    enum: ["Otro","tecnológico", "medicina", "ciencia", "gastronómico","ocio"],
    required: true
},
imgEvent: {
    type:String,
//    default: "https://ipmark.com/wp-content/uploads/eventos-5-800x445.jpg"
},
description: {
    type: String,
    required: true
},
price: Number
}
```

Session model

```javascript
{

sessionName: {
    type: String,
    required: true
},
eventName: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true
},
description: {
    type: String
},
day: {
    type: Number,
    required: true
},

dateSession: {
    type: String,
    required: true
},

startHour: {
    type: String,
    required: true
},
endHour: {
    type: String,
    required: true
},
isAvailable: {
    type: Boolean,
    required: true,
    default: false
},

hall: {
    type: String,
    
},
capacityHall: Number,
hostedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
assistants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
}]
}
```

Payment model

```javascript
{

eventName: {
type: String,
required:true
},
startDate: {
    type: String,
    required:true
},
endDate:{
    type: String,
    required:true
},
itsFree: {
    type: Boolean,
    default: true,
    required:true
} ,
capacity: {
    type: Number,
    required:true
},
sector: {
    type: String,
    enum: ["Otro","tecnológico", "medicina", "ciencia", "gastronómico","ocio"],
    required: true
},
imgEvent: {
    type:String,
//    default: "https://ipmark.com/wp-content/uploads/eventos-5-800x445.jpg"
},
description: {
    type: String,
    required: true
},
price: Number
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                    |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| POST        | `/auth/signup`              | {name, email, password, confirmPassword}      | 201          | 400          | Registers the user in the Database            |
| POST        | `/auth/login`               | {email, password}            | 200            | 400          | Validates credentials, creates and sends Token                 |
| GET         | `/auth/verify`              |                              | 200            | 401          | Verifies the user Token                                        |
| GET         | `/events/:query`            |  {filter query}              | 200            | 400          | Show events in db by filter Name, date and sector              |
| POST        | `/events`                   | {eventName, startDate, endDate, itsFree, price, capacity, sector, description }       | 201        | 400   | Create a new event Document           |
| GET         | `/events/:eventId/details`    |                           | 200            | 400,     | Event details                                        |
| PUT         | `/events/:eventId/edit`      |  {eventName, startDate, endDate, itsFree, price, capacity, sector, description }    | 200            | 400, 401     | Edit event                    |
| DELETE      | `/events/:eventId`         |     {eventId (PARAMS)}        | 200            | 401          | Deletes event                                 |
| POST         | `/events/:eventId/sessions"` |   {eventId (PARAMS), sessionName, description, day, dateSession, startHour, endHour, isAvailable, hall, capacityHall } | 200 | 401 | Create session in  a event                                    |
|PUT         | `/events/:eventId/sessions"` |   {eventId (PARAMS), sessionName, description, day, dateSession, startHour, endHour, isAvailable, hall, capacityHall }         | 200            | 401          | Edit session 
| PUT       | `/events/:eventId/sessions/:sessionId/join`    |    { sessionId(PARAMS),assistants, capacityHall }                  | 200            | 401          | Join a session                 |
| DELETE        | `/events/:eventId/sessions/:sessionId`                  |        {sessionId(PARAMS)}                       | 200            | 401          | delete session                                |
| PUT        | `/events/:eventId/inscription`           |          { eventsUserArr }               | 200            | 401          |                      | join a event |
| GET        | `/user/userProfile`           |                        | 200            | 401          |                      | User profile |
| DELETE        | `/user/deleteAcount`           |                        | 200            | 401          |                      | Delete user |
  
## Links

### Collaborators

[Developer 1 name](https://github.com/Mercedes-amor)

[Developer 2 name](https://github.com/LucasNavarroR/)

### Project

[Repository Link Client](https://github.com/Mercedes-amor/forumEvents-Client)

[Repository Link Server](https://github.com/Mercedes-amor/forumEvents)

[Deploy Link](https://forumevents.netlify.app/)

### Trello

[Link to your trello board](https://trello.com/b/wAWJPZuG/forumevents)

### Slides

[Slides Link](www.your-slides-url-here.com)