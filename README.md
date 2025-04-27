# Goal Tracker API

This is the backend API for the Goal Tracker application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, profile management)
- Goal management (create, read, update, delete)
- Task management (create, read, update, delete)
- AI-assisted goal and task planning

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd goal-tracker-backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   ```bash
   # Copy the template .env file
   cp .env.template .env
   
   # Edit the .env file with your configuration
   # Especially set your MONGO_URI and JWT_SECRET
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user profile (requires authentication)
- `PUT /api/auth/user` - Update user profile (requires authentication)
- `POST /api/auth/reset-password` - Request password reset

### Goals

- `GET /api/goals` - Get all goals for the authenticated user
- `GET /api/goals/:goalId` - Get a specific goal by ID
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:goalId` - Update a goal
- `DELETE /api/goals/:goalId` - Delete a goal
- `PATCH /api/goals/:goalId/complete` - Mark a goal as complete
- `POST /api/goals/generate-plan` - Generate an AI plan for a goal

### Tasks

- `GET /api/goals/:goalId/tasks` - Get all tasks for a specific goal
- `GET /api/tasks/today` - Get tasks scheduled for today
- `POST /api/goals/:goalId/tasks` - Create a new task for a goal
- `PUT /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task
- `PATCH /api/tasks/:taskId` - Toggle task completion status
- `POST /api/goals/:goalId/generate-tasks` - Generate AI tasks for a goal

## Authentication

All routes except `/api/auth/login`, `/api/auth/register`, and `/api/auth/reset-password` require authentication.

To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Database Schema

### User

- `username` - String (required, unique)
- `email` - String (required, unique)
- `password` - String (required, hashed)
- `firstName` - String
- `lastName` - String
- `profilePicture` - String
- `createdAt` - Date

### Goal

- `title` - String (required)
- `description` - String (required)
- `category` - String (enum: Personal, Professional, Health, etc.)
- `targetDate` - Date (required)
- `isCompleted` - Boolean
- `progress` - Number (0-100)
- `priority` - String (enum: Low, Medium, High)
- `user` - ObjectId (ref: User)
- `createdAt` - Date

### Task

- `title` - String (required)
- `description` - String
- `dueDate` - Date (required)
- `isCompleted` - Boolean
- `priority` - String (enum: Low, Medium, High)
- `goal` - ObjectId (ref: Goal)
- `user` - ObjectId (ref: User)
- `createdAt` - Date

## License

MIT