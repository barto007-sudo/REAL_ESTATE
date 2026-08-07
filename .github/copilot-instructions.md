# Real Estate Auction & Rental Management System

## Project Overview
Full-stack web application for managing and auctioning real estate properties with rental management features. This is a complete implementation with authentication, role-based access control, property management, auction system, and rental management.

### Tech Stack
- **Frontend**: React 18 with TypeScript, React Router v6, Axios
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful architecture
- **Tools**: VS Code, npm, concurrently

### Completed Features
✅ User Registration & Login (with role selection)
✅ Role-based Access Control (Admin, Seller, Buyer)
✅ JWT Authentication & Authorization
✅ Property Listing with Filtering
✅ Create, Update, Delete Properties
✅ Auction System with Real-time Bids
✅ Bid History & Tracking
✅ Rental Requests & Management
✅ User Dashboard with Statistics
✅ Responsive UI with Modern CSS
✅ Full TypeScript Type Safety
✅ Error Handling & Validation
✅ Database Initialization Scripts
✅ Development Tasks Configuration

## Project Structure

```
real_estate/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Business logic (auth, property, auction, rental)
│   │   ├── routes/               # API endpoints
│   │   ├── middleware/           # Authentication & authorization
│   │   ├── database/             # DB initialization and schema
│   │   ├── types/                # TypeScript interfaces
│   │   └── index.ts              # Express server
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── dist/                     # Built files (created on build)
│
├── frontend/
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── components/           # Reusable components
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── index.tsx             # React entry point
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .github/
│   └── copilot-instructions.md   # This file
│
├── .vscode/
│   └── tasks.json                # VS Code tasks
│
├── README.md                      # Full documentation
├── QUICKSTART.md                  # Quick setup guide
├── package.json                   # Root scripts
├── .gitignore                     # Git ignore file
└── setup.ps1                      # Windows setup script
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git
- VS Code (optional but recommended)

### Quick Setup (Windows)
```powershell
.\setup.ps1
```

### Manual Setup

#### 1. Backend Configuration
```bash
cd backend
copy .env.example .env
# Edit .env with your PostgreSQL connection string:
# DATABASE_URL=postgresql://user:password@localhost:5432/real_estate
# JWT_SECRET=your_secret_key_here
# PORT=5000
npm install
npm run dev
```

#### 2. Frontend Configuration
```bash
cd frontend
copy .env.example .env.local
# Default API URL: http://localhost:5000/api
npm install
npm start
```

#### 3. Database
The database schema is automatically created on first backend run. Just ensure PostgreSQL is running and the connection URL is correct.

### Default Ports
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Development Guidelines
- Follow TypeScript strict mode (enabled)
- Use functional components with hooks (React)
- Apply REST conventions for APIs
- Write meaningful commit messages
- Test features before merging
- Use environment variables for configuration
- Type all function signatures and return values

## API Endpoints Summary

### Auth Routes (`/api/auth`)
- POST /register - Register new user
- POST /login - User login
- GET /me - Get current user (protected)

### Property Routes (`/api/properties`)
- GET / - List all properties with filters
- GET /:id - Get property details
- POST / - Create property (seller/admin)
- PUT /:id - Update property (owner)
- DELETE /:id - Delete property (owner/admin)

### Auction Routes (`/api/auctions`)
- POST /bids - Place bid (protected)
- GET /bids/:propertyId - Get bids for property
- GET /my-bids - Get user's bids (protected)

### Rental Routes (`/api/rentals`)
- POST / - Create rental request (protected)
- GET / - List rentals with filters
- GET /my-rentals - Get user's rentals (protected)
- PUT /:id - Update rental status (protected)

## Available Scripts

### Root Directory
- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both backend and frontend
- `npm run backend:dev` - Run backend only
- `npm run frontend:dev` - Run frontend only

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Run production build

### Frontend
- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/real_estate
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## User Roles

### Buyer
- Browse properties
- Place bids on auctions
- Request rentals
- View bid history
- View rental requests

### Seller
- Create and manage properties
- List properties for auction
- List properties for rent
- View property statistics

### Admin
- All seller capabilities
- Manage all properties
- Manage all rentals
- System oversight

## Key Database Tables

- **users** - User accounts with roles and authentication
- **properties** - Real estate listings with auction and rental info
- **bids** - Auction bids with amounts and timestamps
- **rentals** - Rental requests with dates and status

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL format and credentials
- Ensure database 'real_estate' exists

### Port Already in Use
- Change PORT in backend .env
- React will prompt to use a different port for frontend

### CORS Issues
- Backend has CORS enabled for all origins
- Verify REACT_APP_API_URL in .env.local

### Module Not Found
- Run `npm install` in both backend and frontend
- Clear node_modules and reinstall if needed

## Testing the Application

1. **Register a Seller**: Go to register, enter details, select "Seller" role
2. **Register a Buyer**: Register another user with "Buyer" role
3. **Create Property**: As seller, click "New Property"
4. **Place Bid**: AS buyer, view property and place a bid
5. **Request Rental**: Select rental property and request dates
6. **Check Dashboard**: View statistics and activities

For complete documentation, see README.md
