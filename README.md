# Node.js + MongoDB Workshop: Employee Management REST API

A hands-on workshop project that builds a REST API for managing employee records using **Node.js**, **Express**, **MongoDB**, and **Mongoose**. Use **MongoDB Compass** to inspect stored data and **Postman/Thunder Client** to test the API.

## What you'll learn

- How Node.js runs JavaScript on the server
- How Express defines HTTP routes and sends JSON responses
- How middleware such as `express.json()` processes incoming requests
- How `async`/`await` handles asynchronous database operations
- How Mongoose schemas and models work
- How to implement CRUD operations: Create, Read, Update, Delete
- How to read route parameters (`req.params`) and query parameters (`req.query`)
- How to test endpoints using Postman and inspect data using MongoDB Compass

## Technology stack

- Node.js
- npm
- Express
- MongoDB Community Server (local installation)
- Mongoose
- MongoDB Compass
- Postman

> **Important:** MongoDB Community Server is the database server. MongoDB Compass is a graphical interface for connecting to and inspecting the server; Compass does not replace the server.

## Architecture

```text
Postman / Client
      |
      | HTTP request (JSON)
      v
Node.js + Express
      |
      | Mongoose
      v
MongoDB Community Server
      |
      v
employeeDB database
      |
      v
employees collection

MongoDB Compass connects to the same MongoDB server
so you can inspect the database and documents.
```

## Prerequisites

Install these before starting:

1. **Node.js (LTS)**, which includes npm: https://nodejs.org/
2. **MongoDB Community Server** for your operating system: https://www.mongodb.com/try/download/community
3. **MongoDB Compass**: https://www.mongodb.com/try/download/compass
4. **Postman**: https://www.postman.com/downloads/

### Local MongoDB setup

For this workshop, the application expects MongoDB to be available at:

```text
mongodb://127.0.0.1:27017
```

`27017` is MongoDB's default port, not a compulsory port. If your MongoDB server is configured to use a different port, update the connection string in `app.js` accordingly.

On Windows, if MongoDB was installed as a service, check that it is running:

1. Press `Windows + R`.
2. Enter `services.msc` and press Enter.
3. Find the MongoDB service and start it if it is stopped.

Open MongoDB Compass and connect using:

```text
mongodb://127.0.0.1:27017/
```

The database `employeeDB` and collection `employees` can be created when the application first inserts data. You do not need to create them manually in Compass first.

## Project structure

```text
employee-management-api/
├── app.js
├── package.json
└── package-lock.json
```

`node_modules/` is created when you install the dependencies and should not normally be committed to Git.

## Setup and run

Open a terminal in the project folder.

### 1. Install dependencies

If this repository contains `package.json`:

```bash
npm install
```

If you are starting from an empty folder instead, initialize the project and install the dependencies:

```bash
npm init -y
npm install express mongoose
```

### 2. Start the API

```bash
node app.js
```

When the database connection succeeds, you should see a message similar to:

```text
MongoDB connected
Server running on http://localhost:3000
```

The exact messages depend on the logging statements in `app.js`.

### 3. Check the server

Open this URL in a browser or send a GET request from Postman:

```text
http://localhost:3000/
```

You should receive the welcome/status message defined in the root route.

## API endpoints

The examples below assume the server is running at `http://localhost:3000`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check that the API is running |
| `POST` | `/employees` | Create an employee |
| `GET` | `/employees` | Retrieve all employees |
| `GET` | `/employees?department=Engineering` | Filter employees by department |
| `GET` | `/employees/:id` | Retrieve one employee by MongoDB ID |
| `PUT` | `/employees/:id` | Update an employee |
| `DELETE` | `/employees/:id` | Delete an employee |
| `GET` | `/employees/designation/:designation` | Retrieve employees by designation |

### Employee fields

The workshop schema uses these fields:

| Field | Type | Rules |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required; intended to be unique |
| `department` | String | Required |
| `designation` | String | Required |
| `salary` | Number | Required; must be at least `0` |

Mongoose's `unique: true` uses a database index; it is not a standard Mongoose validator. A duplicate email may produce a duplicate-key error.

## Test with Postman

### 1. Create an employee

- **Method:** `POST`
- **URL:** `http://localhost:3000/employees`
- **Body:** select **raw** and **JSON**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 60000
}
```

A successful request should return status `201` and the created employee document. MongoDB will assign the document an `_id`.

### 2. Retrieve all employees

- **Method:** `GET`
- **URL:** `http://localhost:3000/employees`

### 3. Filter by department

- **Method:** `GET`
- **URL:** `http://localhost:3000/employees?department=Engineering`

The query parameter is read using `req.query.department`. If you request `/employees` without the query parameter, the example route returns all employees.

Department matching is case-sensitive by default, so use the same spelling and capitalization as the stored value.

### 4. Retrieve one employee

Copy the `_id` returned when creating an employee and replace `:id`:

```text
GET http://localhost:3000/employees/REPLACE_WITH_EMPLOYEE_ID
```

### 5. Update an employee

- **Method:** `PUT`
- **URL:** `http://localhost:3000/employees/REPLACE_WITH_EMPLOYEE_ID`
- **Body:** raw JSON

```json
{
  "salary": 70000
}
```

The example uses `findByIdAndUpdate()` with `{ new: true, runValidators: true }` so it returns the updated document and applies schema validators to the update.

### 6. Delete an employee

- **Method:** `DELETE`
- **URL:** `http://localhost:3000/employees/REPLACE_WITH_EMPLOYEE_ID`

The example returns a success message when an employee is deleted.

### 7. Filter by designation

- **Method:** `GET`
- **URL:** `http://localhost:3000/employees/designation/Software%20Engineer`

URL-encode spaces in the designation where necessary.

## Key concepts in the code

### Middleware

```javascript
app.use(express.json());
```

This middleware parses incoming JSON request bodies and makes the parsed data available as `req.body`. Register it before routes that need to read JSON bodies.

### Arrow functions and route handlers

```javascript
app.get("/employees", async (req, res) => {
  // Handle the request here
});
```

Express calls the route handler when a matching request arrives. `req` represents the request, and `res` is used to send the response. The arrow function is a shorter function syntax.

### `async` and `await`

Database operations can take time. Marking a route handler `async` allows it to use `await`:

```javascript
const employees = await Employee.find();
```

This lets the handler use the result after the asynchronous operation completes without blocking Node.js from handling other work.

### Mongoose schema and model

The schema defines employee fields and rules. The `Employee` model provides methods such as `create()`, `find()`, `findById()`, `findByIdAndUpdate()`, and `findByIdAndDelete()` to interact with MongoDB.

### Request data

- `req.body`: data sent in the request body, commonly with `POST` and `PUT`
- `req.params`: values embedded in the route path, such as `/employees/:id`
- `req.query`: query-string values, such as `?department=Engineering`

## Workshop exercises

Try these after completing the CRUD API:

1. **Count employees:** Add `GET /employees/count` that returns the total number of employees using `Employee.countDocuments()`.
2. **Filter by department in the path:** Add `GET /employees/department/:department`.
3. **Find high-salary employees:** Add `GET /employees/high-salary/:amount` to return employees whose salary is greater than the supplied amount. Convert the URL parameter to a number before comparing it to the numeric salary field.
4. **Add experience:** Add an `experience` number field to the schema, require it, and enforce a minimum of `0`.

> **Route-order note:** If you add `/employees/count`, define it before `/employees/:id`. Otherwise, Express may interpret `count` as the `id` parameter.

## Troubleshooting

### `MongoDB connection error` or `ECONNREFUSED`

- Confirm MongoDB Community Server is installed and running.
- Check that the connection string uses the correct host and port.
- On Windows, inspect the MongoDB service in `services.msc`.
- If MongoDB uses a non-default port, update the URI in `app.js`.

### `mongosh` is not recognized

The MongoDB Shell (`mongosh`) may not be installed or added to `PATH`. This does not necessarily mean the database server is missing. You can still verify the server connection using Compass.

### `req.body` is `undefined` or empty

- Ensure `app.use(express.json())` appears before the route definitions.
- In Postman, select **Body → raw → JSON** and send valid JSON.

### The department filter returns every employee

- Use `GET /employees?department=Engineering`, not `/employees/Engineering`.
- Check that the route reads `req.query.department`.
- Check the terminal output and the exact capitalization of the stored department.

### Duplicate email error

The `email` field is configured as unique. Use a new email for each test employee or handle duplicate-key errors explicitly.

### Invalid employee ID

MongoDB IDs are normally ObjectId values. Use the `_id` returned by MongoDB when creating an employee. An invalid ID can result in a Mongoose casting error.

## Notes

- This is a **workshop/learning project**, not a production-ready employee system.
- It does not include authentication, authorization, pagination, or comprehensive input validation.
- Do not use real employee personal information or salary data in a public workshop repository.
- Never commit credentials, secrets, or local environment files.

## Learning outcome

By the end of the workshop, you should be able to explain and implement the request flow:

```text
Client → Express middleware → Route handler
       → Mongoose → MongoDB → JSON response
```

You should also be able to test the API in Postman and inspect the resulting documents in MongoDB Compass.

