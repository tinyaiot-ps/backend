
# backend

# Backend Project

TinyAIOT backend project built with Node.js and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v12 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/tinyaiot-ps/backend.git
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the necessary environment variables (e.g., database connection string, JWT secret, etc.).

## Scripts

This project includes several npm scripts to help you develop, build, and run the application:

- `npm run dev`: Starts the development server using nodemon for auto-reloading.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm start`: Runs the compiled JavaScript code.
- `npm run serve`: An alias for `npm start`.

## Development

To start the development server with auto-reloading:

```
npm run dev
```

## Building for Production

To build the project for production:

```
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.

## Running in Production

To run the built project:

```
npm start
```

or

```
npm run serve
```

## Dependencies

This project uses several key dependencies:

- Express.js: Web application framework
- Mongoose: MongoDB object modeling tool
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- MQTT: For MQTT protocol support
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variable management

For a full list of dependencies and devDependencies, please refer to the `package.json` file.


## API Documentation

# Backend Project

This is a backend project built with Node.js and TypeScript.

## API Documentation

This section provides documentation for the implemented API endpoints in the backend. These can be used to ensure smooth usage by the frontend team.

### Base URL

The base URL for all API requests is:

```
localhost:5000/api/v1
```

### Authentication

#### Login

- **URL**: `/auth/login`
- **Method**: POST
- **Description**: Universal login route for all types of Users ('USER', 'ADMIN', 'SUPERADMIN')
- **Body Parameters**:
  - `email` (String): The user's email address
  - `password` (String): The user's password
- **Status Codes**:
  - 200: OK
  - 401: Unauthorized (invalid credentials)
  - 404: Not found (user not found)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "Logged in successfully.",
    "user": {
      "id": "664db395875c07239abe7879",
      "email": "superadmin@tinyaiot.com",
      "role": "SUPERADMIN"
    },
    "token": "JpZCI6IjY2NGRiMzk1ODc1YzA3MjM5YWJlNzg3OSIsInJvbGUiOiJTVVBFUkFETUlOIiwiaWF0IjoxNzE3NTg0MzA2LCJleHAiOjE3MTc3NTcxMDZ9.swgoMlWCL_opDSa-rhgcCt6RhaympBkfzZPj7Ap4tSc"
  }
  ```

#### Signup

- **URL**: `/auth/signup`
- **Method**: POST
- **Description**: Universal signup route for User types ('USER', 'ADMIN'). Only users with the role ADMIN or SUPERADMIN can create new users.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `role` (String): The role of the new user ('USER', 'ADMIN', 'SUPERADMIN')
  - `email` (String): The email address for the new user
  - `password` (String): The password for the new user
  - `projects` (Array): An array of project IDs the user is associated with
  - `preferences` (Object): User preferences including `language` and `themeIsDark`
- **Status Codes**:
  - 201: Created
  - 403: Forbidden (choose role SUPERADMIN or ADMIN)
  - 409: Conflict (user already existing)
  - 500: Internal server error
- **Request Body Example**:
  ```json
  {
    "role": "USER",
    "email": "newuser@example.com",
    "password": "newuserpassword",
    "projects": ["60d5ec49eb172b30fc6d16a2"],
    "preferences": {
      "language": "EN",
      "themeIsDark": false
    }
  }
  ```

#### Update User

- **URL**: `/auth/user`
- **Method**: PATCH
- **Description**: Updates an existing user's details. Only SUPERADMIN can update all users. ADMIN can update users related to their projects, and users can update their own details.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `userId` (String): The ID of the user to update
  - `role` (String, optional): The new role of the user ('USER', 'ADMIN')
  - `email` (String, optional): The new email address of the user
  - `password` (String, optional): The new password for the user
  - `projects` (Array, optional): An updated array of project IDs the user is associated with
  - `preferences` (Object, optional): Updated user preferences including `language` and `themeIsDark`
- **Status Codes**:
  - 200: OK
  - 403: Forbidden (user can only update itself, otherwise choose role SUPERADMIN or ADMIN)
  - 404: Not found (user not found)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "User updated successfully.",
    "user": {
      "id": "60d5ec49eb172b30fc6d16b1",
      "email": "updatedemail@example.com",
      "role": "USER",
      "projects": ["60d5ec49eb172b30fc6d16a2"],
      "preferences": {
        "language": "DE",
        "themeIsDark": true
      }
    }
  }
  ```

### City

#### Get City by ID

- **URL**: `/city/{id}`
- **Method**: GET
- **Description**: Get a specific city by its ID
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the city to retrieve
- **Status Codes**:
  - 200: OK
  - 404: City not found (city is not yet created)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "City found",
    "city": {
      "_id": "60d5ec49eb172b30fc6d16b1",
      "name": "Münster",
      "createdAt": "2023-10-10T14:48:00.000Z",
      "updatedAt": "2023-10-10T14:48:00.000Z"
    }
  }
  ```

#### Get All Cities

- **URL**: `/city`
- **Method**: GET
- **Description**: Get a list of all cities
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Status Codes**:
  - 200: OK
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "Cities found",
    "cities": [
      {
        "_id": "60d5ec49eb172b30fc6d16b1",
        "name": "Münster",
        "createdAt": "2023-10-10T14:48:00.000Z",
        "updatedAt": "2023-10-10T14:48:00.000Z"
      },
      {
        "_id": "60d5ec49eb172b30fc6d16b2",
        "name": "Emsdetten",
        "createdAt": "2023-10-10T14:48:00.000Z",
        "updatedAt": "2023-10-10T14:48:00.000Z"
      }
    ]
  }
  ```

#### Create City

- **URL**: `/city`
- **Method**: POST
- **Description**: Create a new city. Only users with the role SUPERADMIN can create new cities.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `name` (String): The name of the city, must be unique
- **Status Codes**:
  - 201: Created
  - 403: Forbidden (choose role SUPERADMIN)
  - 409: Conflict (city already exists)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b3",
    "name": "Hamburg",
    "createdAt": "2023-10-10T14:48:00.000Z",
    "updatedAt": "2023-10-10T14:48:00.000Z"
  }
  ```

### Project

#### Get All Projects

- **URL**: `/project`
- **Method**: GET
- **Description**: Get a list of all projects
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Status Codes**:
  - 200: OK
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "projects": [
      {
        "_id": "60d5ec49eb172b30fc6d16b1",
        "name": "Project 1",
        "city": "60d5ec49eb172b30fc6d16b1",
        "users": ["60d5ec49eb172b30fc6d16b1"],
        "centerCoords": [7.6261, 51.9607],
        "initialZoom": 10,
        "preferences": {
          "fillThresholds": [30, 70],
          "batteryThresholds": [30, 70]
        },
        "createdAt": "2023-10-10T14:48:00.000Z",
        "updatedAt": "2023-10-10T14:48:00.000Z"
      }
    ]
  }
  ```

#### Get Project by ID

- **URL**: `/project/{id}`
- **Method**: GET
- **Description**: Get a specific project by its ID
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the project to retrieve
- **Status Codes**:
  - 200: OK
  - 404: Project not found (project is not yet created)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "project": {
      "_id": "60d5ec49eb172b30fc6d16b1",
      "name": "Project Alpha",
      "city": "60d5ec49eb172b30fc6d16b1",
      "users": ["60d5ec49eb172b30fc6d16b1"],
      "centerCoords": [7.6261, 51.9607],
      "initialZoom": 10,
      "preferences": {
        "fillThresholds": [30, 70],
        "batteryThresholds": [30, 70]
      },
      "createdAt": "2023-10-10T14:48:00.000Z",
      "updatedAt": "2023-10-10T14:48:00.000Z"
    }
  }
  ```

#### Create Project

- **URL**: `/project`
- **Method**: POST
- **Description**: Create a new project. Only users with the role SUPERADMIN can create new projects.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `name` (String): The name of the project, must be unique
  - `city` (String): The ID of the associated city
  - `users` (Array): An array of user IDs associated with the project
  - `centerCoords` (Array): The center coordinates of the project, [longitude, latitude]
  - `initialZoom` (Number): Initial zoom level for the project map
  - `preferences` (Object): Preference settings for the project, including `fillThresholds` and `batteryThresholds`
- **Status Codes**:
  - 201: Created
  - 403: Forbidden (choose role SUPERADMIN)
  - 409: Conflict (project already exists)
  - 404: Not found (City or user does not exist)
  - 500: Internal server error
- **Request Body Example**:
  ```json
  {
    "name": "Project 2",
    "city": "60d5ec49eb172b30fc6d16b2",
    "users": ["60d5ec49eb172b30fc6d16b3", "60d5ec49eb172b30fc6d16b4"],
    "centerCoords": [7.62, 51.96],
    "initialZoom": 8,
    "preferences": {
      "fillThresholds": [25, 75],
      "batteryThresholds": [20, 80]
    }
  }
  ```

#### Update Project

- **URL**: `/project/{id}`
- **Method**: PATCH
- **Description**: Update an existing project. Only users associated with the project or with the role SUPERADMIN can update the project.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the project to update
- **Body Parameters**: (all optional)
  - `name` (String): The new name of the project (must be unique)
  - `city` (String): The ID of the associated city
  - `users` (Array): An array of user IDs associated with the project
  - `centerCoords` (Array): The new center coordinates of the project, [longitude, latitude]
  - `initialZoom` (Number): Initial zoom level for the project map
  - `preferences` (Object): New preference settings for the project, including `fillThresholds` and `batteryThresholds`
- **Status Codes**:
  - 200: OK
  - 403: Forbidden (choose role SUPERADMIN)
  - 409: Conflict (project already exists)
  - 404: Not found (City or project does not exist)
  - 500: Internal server error
- **Request Body Example**:
  ```json
  {
    "name": "Updated Project 1",
    "city": "60d5ec49eb172b30fc6d16b1",
    "users": ["60d5ec49eb172b30fc6d16b1", "60d5ec49eb172b30fc6d16b2"],
    "centerCoords": [7.63, 51.97],
    "initialZoom": 9,
    "preferences": {
      "fillThresholds": [20, 80],
      "batteryThresholds": [25, 75]
    }
  }
  ```

### Sensor

#### Get All Sensors

- **URL**: `/sensors`
- **Method**: GET
- **Description**: Get a list of all sensors
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Status Codes**:
  - 200: OK
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b1",
    "trashbin": {
      "_id": "60d5ec49eb172b30fc6d16a1",
      "name": "Trashbin A",
      "project": "60d5ec49eb172b30fc6d16a2"
    },
    "measure": "fill_level",
    "unit": "percentage",
    "history": [],
    "createdAt": "2023-10-10T14:48:00.000Z",
    "updatedAt": "2023-10-10T14:48:00.000Z"
  }
  ```

#### Get Sensor by ID

- **URL**: `/sensors/{id}`
- **Method**: GET
- **Description**: Get a specific sensor by its ID
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the sensor to retrieve
- **Status Codes**:
  - 200: OK
  - 404: Sensor not found (sensor is not yet created)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b1",
    "trashbin": {
      "_id": "60d5ec49eb172b30fc6d16a1",
      "name": "Trashbin A",
      "project": "60d5ec49eb172b30fc6d16a2

#### Get Sensor by ID (continued)

- **Response Example** (continued):
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b1",
    "trashbin": {
      "_id": "60d5ec49eb172b30fc6d16a1",
      "name": "Trashbin A",
      "project": "60d5ec49eb172b30fc6d16a2"
    },
    "measure": "fill_level",
    "unit": "percentage",
    "history": [],
    "createdAt": "2023-10-10T14:48:00.000Z",
    "updatedAt": "2023-10-10T14:48:00.000Z"
  }
  ```

#### Create Sensor

- **URL**: `/sensors`
- **Method**: POST
- **Description**: Create a new sensor and associate it with a trashbin. Only users associated with the project that the trashbin belongs to can create sensors within that project.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `trashbinID` (String): The ID of the associated trashbin
  - `measure` (String): The type of measure, either `fill_level` or `battery_level`
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (trashbinID is required)
  - 403: Forbidden (user has to be associated to project that sensor belongs to)
  - 404: Not found (Trashbin or project does not exist)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "Sensor created successfully",
    "newSensor": {
      "_id": "60d5ec49eb172b30fc6d16b1",
      "trashbin": "60d5ec49eb172b30fc6d16a1",
      "measure": "fill_level",
      "unit": "percentage",
      "history": [],
      "createdAt": "2023-10-10T14:48:00.000Z",
      "updatedAt": "2023-10-10T14:48:00.000Z"
    }
  }
  ```

### Trashbin

#### Get All Trashbins

- **URL**: `/trashbins`
- **Method**: GET
- **Description**: Get a list of all trash bins
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Status Codes**:
  - 200: OK
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b1",
    "identifier": "TRB123",
    "coordinates": [7.6261, 51.9607],
    "location": "Location Name",
    "project": "60d5ec49eb172b30fc6d16a2",
    "sensors": [],
    "createdAt": "2023-10-10T14:48:00.000Z",
    "updatedAt": "2023-10-10T14:48:00.000Z"
  }
  ```

#### Get Trashbin by ID

- **URL**: `/trashbins/{id}`
- **Method**: GET
- **Description**: Get a specific trash bin by its ID
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the trash bin to retrieve
- **Status Codes**:
  - 200: OK
  - 404: Trashbin not found (trashbin is not yet created)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "_id": "60d5ec49eb172b30fc6d16b1",
    "identifier": "TRB123",
    "coordinates": [7.6261, 51.9607],
    "location": "Location Name",
    "project": "60d5ec49eb172b30fc6d16a2",
    "sensors": [],
    "createdAt": "2023-10-10T14:48:00.000Z",
    "updatedAt": "2023-10-10T14:48:00.000Z"
  }
  ```

#### Create Trashbin

- **URL**: `/trashbins`
- **Method**: POST
- **Description**: Create a new trashbin and associate it with a project. Only users with the role SUPERADMIN or ADMIN belonging to the project can create trashbins.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Body Parameters**:
  - `project` (String): The ID of the associated project
  - `longitude` (Number): The longitude coordinate of the trashbin
  - `latitude` (Number): The latitude coordinate of the trashbin
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (trashbinID is required)
  - 403: Forbidden (user has to be associated to project + choose role SUPERADMIN or ADMIN)
  - 404: Not found (Trashbin or project does not exist)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "Trash can created successfully"
  }
  ```

#### Update Trashbin

- **URL**: `/trashbins/{id}`
- **Method**: PATCH
- **Description**: Update an existing trashbin. Only users with the role SUPERADMIN or ADMIN belonging to the project can update trashbins.
- **Headers**:
  - `Authorization` (String) [required]: Bearer token
- **Path Parameters**:
  - `id` (String): The ID of the trashbin to update
- **Status Codes**:
  - 200: OK
  - 403: Forbidden (choose role SUPERADMIN or ADMIN)
  - 404: Not found (Trashbin or project does not exist)
  - 500: Internal server error
- **Response Example**:
  ```json
  {
    "message": "Trash can updated successfully"
  }
  ```

This concludes the API documentation section.

## License

This project is licensed under the ISC License.
