# Event/Workshop Management System Backend API

This is a RESTful API built with Node.js, Express, and PostgreSQL for an event and workshop management system.

## Setup Instructions

1. Clone or download this project.
2. Run \`npm install\` to install dependencies.
3. Define your environment variables in a \`.env\` file. (See \`.env.example\` or reference the details below):
   \`\`\`
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=events_db
   JWT_SECRET=your_jwt_secret_key
   \`\`\`
4. Run \`npm run init-db\` to create the necessary tables in your PostgreSQL database.
5. Run \`npm start\` (or \`npm run dev\` for nodemon) to start the server.

## API Endpoints

### 1. Authentication

#### Register a new user
- **URL:** \`/api/auth/register\`
- **Method:** \`POST\`
- **Body:**
  \`\`\`json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  \`\`\`
- **Response:** \`201 Created\` on success, returning the user information.

#### Login
- **URL:** \`/api/auth/login\`
- **Method:** \`POST\`
- **Body:**
  \`\`\`json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  \`\`\`
- **Response:** \`200 OK\` on success, returning the JWT \`token\` and user details.

---

### 2. Events

#### Get All Events
- **URL:** \`/api/events\`
- **Method:** \`GET\`
- **Description:** Fetch all events with their current status (Now, Upcoming, Finished).
- **Response:** \`200 OK\` on success, returning an array of event objects.

#### Register for an Event
- **URL:** \`/api/events/register-event\`
- **Method:** \`POST\`
- **Headers:** 
  \`Authorization: Bearer <your_jwt_token>\`
- **Body:**
  \`\`\`json
  {
    "event_id": 1
  }
  \`\`\`
- **Description:** Registers the authenticated user for the specified event.
  - Checks if the user is authenticated (401 error otherwise).
  - Checks if the event has capacity remaining.
  - Ensures a user cannot register for the same event twice.
  - Generates a "Success" notification in the database.
  - Simulates an email sent to the user via Nodemailer.
- **Response:** \`201 Created\` on success.

## Database Schema

- **Users:** \`id\`, \`name\`, \`email\`, \`password\`, \`created_at\`
- **Events:** \`id\`, \`title\`, \`description\`, \`type\` (workshop/seminar), \`date\`, \`capacity\`, \`created_at\`
- **Registrations:** \`id\`, \`user_id\`, \`event_id\`, \`registered_at\` 
  *(Unique constraint on user_id and event_id together)*
- **Notifications:** \`id\`, \`user_id\`, \`message\`, \`status\`, \`created_at\`
