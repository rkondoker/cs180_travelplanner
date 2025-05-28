# API Documentation

## Authentication

### Sign Up

- Endpoint: `POST /auth/signup`
- Body: `{ email, password, username }`
- Response: `{ user, session }`

### Sign In

- Endpoint: `POST /auth/signin`
- Body: `{ email, password }`
- Response: `{ user, session }`

### Sign Out

- Endpoint: `POST /auth/signout`
- Response: `{ success: boolean }`

## Trips

### Create Trip

- Endpoint: `POST /trips`
- Body: `{ title, start_date, end_date, city, state_or_country }`
- Response: `{ trip_id, ...trip_details }`

### Get User Trips

- Endpoint: `GET /trips`
- Response: `[{ trip_id, ...trip_details }]`

## Maps

### Get Location Details

- Endpoint: `GET /places/:id`
- Response: `{ name, address, phone, rating }`

### Calculate Route

- Endpoint: `POST /routes`
- Body: `{ origin, destination, waypoints }`
- Response: `{ distance, duration, route }`
