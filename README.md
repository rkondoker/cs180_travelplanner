# CS180_TravelPlanner

## Commands

### Pulling From Repository

When you pull the repoistory to your local machine, be sure to run the following command to install all dependencies:

```
npm i
```

### Important Keys

Create a new file in the root of the project called `.env.local` and paste the following data:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WEATHER_API_KEY=
```

**IMPORTANT NOTE**
**When you push your changes to the repository, do not push any of the keys used in this project.**

### Running the Website

When you want to run the website, use the following command:

```
npm run dev
```

## Features

### Authentication
- User registration and login
- Secure password handling
- Session management with Supabase

### Map Exploration
- Interactive Google Maps integration
- Location search and markers
- Route planning between points
- Distance and time calculations

### Trip Planning
- Create and save trips
- Add multiple destinations
- Optimize routes
- Weather information integration

### User Dashboard
- View saved trips
- Edit trip details
- Delete trips
- Share trip information

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test testing/tests/unit/pages/sign-in.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Test Structure
- Unit tests for components
- Integration tests for pages
- Mock implementations for external services
- Test coverage reporting

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Maintain consistent naming conventions

### Component Structure
- Keep components focused and single-responsibility
- Use proper prop typing
- Implement error boundaries
- Follow accessibility guidelines

### State Management
- Use React hooks for local state
- Implement proper form handling
- Manage async operations correctly
- Handle loading and error states

## API Integration

### Supabase
- User authentication
- Database operations
- Real-time updates
- File storage

### Google Maps
- Map rendering
- Geocoding
- Directions service
- Places API

### Weather API
- Current conditions
- Forecast data
- Location-based weather

## Deployment

### Environment Setup
1. Set up environment variables
2. Configure API keys
3. Set up database
4. Configure build settings

### Build Process
```bash
# Create production build
npm run build

# Start production server
npm start
```

## Contributing

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add/update tests
4. Update documentation
5. Submit PR

### Code Review
- Follow TypeScript guidelines
- Maintain test coverage
- Update documentation
- Check accessibility

## Troubleshooting

### Common Issues
- API key configuration
- Database connection
- Map loading
- Authentication flow

### Debug Tools
- React Developer Tools
- Network monitoring
- Console logging
- Error tracking

## Security

### Best Practices
- Secure API key handling
- Input validation
- XSS prevention
- CSRF protection

### Authentication
- Secure password storage
- Session management
- Token handling
- Access control
