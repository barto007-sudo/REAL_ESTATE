# Real Estate Auction & Rental Management System

A comprehensive full-stack web application for managing and auctioning real estate properties with rental management features.

## 🎯 Features

- **User Authentication & Authorization**
  - Role-based access control (Admin, Seller, Buyer)
  - JWT-based authentication
  - Secure password hashing with bcrypt

- **Property Management**
  - Create, update, and delete properties
  - List properties with filtering by city, auction, and rental availability
  - Detailed property information and specifications

- **Auction System**
  - Real-time auction listings
  - Place bids on properties
  - Automatic auction duration management
  - Bid history tracking

- **Rental Management**
  - Request rentals for available properties
  - Date range selection
  - Rental status tracking (pending, active, completed, cancelled)
  - Monthly rental pricing

- **Dashboard**
  - User-specific dashboard with quick statistics
  - Property management tools for sellers
  - Bid tracking for buyers
  - Rental management interface

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL 12 or higher
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd real_estate
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL connection string
# DATABASE_URL=postgresql://user:password@localhost:5432/real_estate
# JWT_SECRET=your_secret_key_here

# The database will be initialized automatically on first run
# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local if needed
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📦 Project Structure

```
real_estate/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Authentication & validation
│   │   ├── database/           # Database initialization
│   │   ├── types/              # TypeScript interfaces
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css             # Global styles
│   │   └── index.tsx           # React entry point
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── .github/
    └── copilot-instructions.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (seller/admin only)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Auctions
- `POST /api/auctions/bids` - Place a bid
- `GET /api/auctions/bids/:propertyId` - Get bids for a property
- `GET /api/auctions/my-bids` - Get user's bids

### Rentals
- `POST /api/rentals` - Request a rental
- `GET /api/rentals` - Get rentals (with filters)
- `GET /api/rentals/my-rentals` - Get user's rentals
- `PUT /api/rentals/:id` - Update rental status

## 🔐 Authentication

The application uses JWT tokens for authentication. When a user logs in or registers:
1. The server returns a JWT token
2. The token is stored in localStorage
3. The token is sent in the Authorization header for all authenticated requests
4. The token expires after 24 hours

Format: `Authorization: Bearer <token>`

## 📝 Development Guidelines

- Use TypeScript strict mode
- Follow REST conventions for API design
- Use functional components with React hooks
- Maintain clean separation of concerns
- Write meaningful commit messages
- Test before submitting changes

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database user permissions

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: The app will prompt to use a different port

### CORS Errors
- Ensure REACT_APP_API_URL in frontend .env.local points to the correct backend URL
- Check CORS configuration in backend (already enabled for all origins)

## 📄 License

MIT

## 👥 Support

For issues and questions, please open an issue in the repository.

---

Happy coding! 🎉
