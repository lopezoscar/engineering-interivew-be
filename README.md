# Getting Started with the Every.io engineering challenge.

Thanks for taking the time to complete the Every.io code challenge. Don't worry, it's not too hard, and please do not spend more than an hour or two. We know you have lots of these to do, and it can be very time consuming.

## The biggest factor will be your code:

1. How readable, is your code.
2. Scalability.
3. Are there any bugs.

## Requirements

You will be creating an API for a task application.

1. This application will have tasks with four different states:
   - To do
   - In Progress
   - Done
   - Archived
2. Each task should contain: Title, Description, and what the current status is.
3. A task can be archived and moved between columns, or statuses.
4. The endpoint for tasks should only display tasks for those users who have authenticated and are authorized to view their tasks.

## Ideal

- Typescript
- Tests
- Dockerized Application

## Extra credit

- Apollo Server GraphQL
- Logging

## API Design

1. GET /tasks
2. GET /tasks/:id
3. POST /tasks
4. PATCH /tasks:/id
5. DELETE /tasks/:id

## Model

```
Task Schema
{
   _id: ObjectId,
   title: string,
   description: string,
   status: string
}

```

## AuthN/Z
JWT
Please include in your Authorization header a valid Bearer token in order to work.

For example
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE2NjY3MjQwNDl9.ep9boK4eno_WaejhIQdgmXJlc6ktKAVhmMGkl0Fk0A4
```
You could generate your own JWT token using the script `src/scripts/generate-token`

## Architecture

1. app.js
2. routes (endpoint handlers)
3. services (business logic)
4. models (database access and third party)
5. errors (error objects)

# linter
standardjs