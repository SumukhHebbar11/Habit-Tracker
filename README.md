# Habit Tracker

A modern, full-stack habit tracking application built with React and Node.js. Track your daily habits, visualize your progress, and build lasting routines with an intuitive and engaging interface.

## 🌟 Features

### Core Functionality

- **User Authentication**: Secure login and registration with JWT
- **Habit Management**: Create, edit, delete, and organize habits by category
- **Daily Tracking**: Mark habits as complete with progress tracking
- **Streak Tracking**: Automatic calculation of current streaks
- **Goal Setting**: Set daily goals for each habit (1-100 completions)

### Dashboard & Analytics

- **Summary Cards**: Total habits, completed today, average streak, daily progress
- **Interactive Charts**: Weekly progress trends and category breakdowns
- **Real-time Updates**: Live progress tracking with smooth animations
- **Category Filtering**: Filter habits by Health, Fitness, Learning, etc.

### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, portfolio-ready design with TailwindCSS
- **Smooth Animations**: Engaging hover effects, progress animations, and completion celebrations
- **Color Customization**: Personalize each habit with custom colors
- **Performance Optimized**: Memoized components and efficient re-rendering

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Query** - Server state management and caching
- **React Hook Form + Zod** - Form handling and validation
- **Recharts** - Beautiful, responsive charts
- **Framer Motion** - Smooth animations

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Zod** - Runtime type checking and validation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Set up environment variables**
   Create a `.env` file in the `server` directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/habit-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   PORT=5001
   CLIENT_URL=http://localhost:5173
   ```

3. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

### Seeding Sample Data

After registering a user, seed sample habits with completion history:

```bash
cd server
npm run seed
```

## 📱 Application Structure

```
habit-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   ├── HabitForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Spinner.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Habits.jsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── styles/        # CSS files
│   │   │   └── forms.css
│   │   └── utils/         # Utility functions
│   │       └── api.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   └── habitController.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   └── Habit.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   └── habitRoutes.js
│   ├── middleware/       # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── config/          # Configuration
│   │   └── db.js
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeding
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Habits

- `GET /api/habits` - Get all user habits (protected)
- `POST /api/habits` - Create new habit (protected)
- `PUT /api/habits/:id` - Update habit (protected)
- `DELETE /api/habits/:id` - Delete habit (protected)
- `POST /api/habits/:id/complete` - Mark habit complete (protected)
- `POST /api/habits/:id/uncomplete` - Undo habit completion (protected)
- `GET /api/habits/stats` - Get habit statistics (protected)

## 💾 Database Models

### User Model

```javascript
{
  username: String (required, min: 3)
  email: String (required, unique, email format)
  password: String (required, min: 6, hashed)
  timestamps: true
}
```

### Habit Model

```javascript
{
  name: String (required, max: 100)
  category: String (enum: Health, Fitness, Learning, etc.)
  dailyGoal: Number (required, 1-100)
  completedDates: [
    {
      date: Date,
      count: Number (completion count for that day)
    }
  ]
  user: ObjectId (ref: User)
  color: String (hex color code)
  isActive: Boolean (default: true)
  timestamps: true
}
```

## 🎨 Features in Detail

### Dashboard

- **Summary Cards**: Visual overview of habit statistics
- **Weekly Progress Chart**: Line chart showing completion trends
- **Category Breakdown**: Pie chart of habit distribution
- **Today's Habits**: Interactive cards for daily tracking

### Habit Management

- **Create/Edit**: Modal forms with validation and color picker
- **Progress Tracking**: Visual progress bars and completion animations
- **Streak Calculation**: Automatic streak tracking with visual indicators
- **Category Filtering**: Filter habits by category on habits page

### User Experience Enhancements

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and validation
- **Performance**: Optimized with React Query caching and memoization

## 🎯 Development

### Performance Optimizations Applied

Following React 18 best practices:

- **Memoization**: All form configurations and callbacks are memoized
- **Context Optimization**: AuthContext values are memoized to prevent re-renders
- **Component Structure**: No inline objects, functions, or styles
- **Consistent CSS**: Reusable form.css classes instead of inline styles

### Available Scripts

**Frontend (client/)**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend (server/)**

- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm run seed` - Seed sample data

### Code Quality Features

- Form validation with Zod schemas
- Error handling middleware
- JWT authentication with secure practices
- Input sanitization and validation

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the client: `npm run build`
2. Deploy the `client/dist` folder
3. Set environment variables for API URL

### Backend (Railway/Render/Heroku)

1. Deploy the `server/` folder
2. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the established patterns
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
