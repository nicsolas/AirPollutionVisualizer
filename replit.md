# Air Pollution 3D Visualization Application

## Overview

This is an interactive 3D visualization application for air pollution data. The project combines a React frontend with Three.js for 3D rendering and an Express backend that serves pollution data. The application allows users to visualize air quality data for various cities, see detailed information about different pollutants, and interact with a 3D scene that represents pollution particles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

1. **Frontend**: React application with Three.js for 3D rendering, using Tailwind CSS and shadcn/ui components for styling
2. **Backend**: Express.js server that provides API endpoints for city and pollution data
3. **Database**: Designed to use Drizzle ORM with PostgreSQL (currently using in-memory storage)
4. **State Management**: Combination of React Query for server state and Zustand for client state

The application uses a monorepo structure with shared types and schemas between frontend and backend, enabling type safety across the entire application.

## Key Components

### Frontend

1. **3D Visualization**: Uses Three.js through React Three Fiber to render interactive pollution particle systems that represent air quality data in cities or indoor environments.

2. **UI Components**: Built using shadcn/ui component library with Tailwind CSS for consistent styling. Includes:
   - City selector
   - Air quality index display
   - Pollutant information panels
   - Time controls for historical data
   - Visualization settings

3. **State Management**:
   - React Query for API data fetching
   - Zustand for application state (pollution settings, audio, game state)

4. **Routing**: React Router for page navigation between Home, About, and Pollutants pages

### Backend

1. **API Endpoints**:
   - `/api/cities` - Returns a list of available cities
   - `/api/pollution/:cityId` - Returns pollution data for a specific city
   
2. **Data Handling**: Currently uses mock data providers in the `server/data` directory

3. **Storage**: Designed with a database abstraction layer that currently uses in-memory storage but is prepared for PostgreSQL integration

### Shared

1. **Types**: Comprehensive TypeScript type definitions for air quality data, pollutants, and visualization settings

2. **Database Schema**: Drizzle schema definitions for users and authentication

## Data Flow

1. **User Selection**: The user selects a city and pollutant type in the UI
2. **Data Fetching**: React Query sends a request to the backend API
3. **Data Processing**: The backend retrieves the pollution data (currently from mock data)
4. **Visualization**: The frontend receives the data and uses it to update the 3D visualization
5. **User Interaction**: Users can manipulate view settings, time periods, and explore different aspects of the pollution data

## External Dependencies

### Frontend
- **Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing for 3D rendering
- **UI Components**: Radix UI components (via shadcn/ui) for accessible UI elements
- **State Management**: @tanstack/react-query for data fetching, zustand for state management
- **Styling**: Tailwind CSS for utility-first styling

### Backend
- **Server**: Express.js for API endpoints
- **Database**: Drizzle ORM with PostgreSQL (configured but not fully implemented)

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development**: `npm run dev` script that runs the Express server with Vite middleware for frontend hot reloading
2. **Production Build**: Builds both frontend and backend code for production deployment
3. **Database**: Set up to use PostgreSQL with Drizzle ORM in production

The application is configured to run on port 5000 and exposes this as port 80 externally through Replit's deployment configuration.

## Getting Started

1. Ensure the DATABASE_URL environment variable is set for PostgreSQL connection
2. Run `npm run dev` to start the development server
3. The application will be available at http://localhost:5000

## Future Enhancements

1. **Database Integration**: Complete the integration with PostgreSQL using the Drizzle ORM setup
2. **Authentication**: Implement user authentication using the defined user schema
3. **Real API Data**: Replace mock data with connections to real air quality APIs
4. **Enhanced Visualizations**: Add more detailed 3D models and effects to the visualization