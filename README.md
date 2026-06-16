# Polling App

A full-stack real-time polling application built with modern web technologies. Create polls, share them with others, and see live voting results.

**Live Demo:** [https://polling-app-six-lac.vercel.app](https://polling-app-six-lac.vercel.app)

## Features

- 🗳️ **Create Polls** - Easily create multiple-choice polls
- 📊 **Real-Time Results** - Watch voting results update instantly with Socket.IO
- 🔐 **User Authentication** - Secure sign-up and login with JWT
- 🔒 **Vote Management** - Track your votes and prevent duplicate voting
- 📈 **Analytics Dashboard** - View detailed poll statistics and charts
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Radix UI** - Headless components
- **Zod** - Schema validation

### Backend
- **Node.js/Express 5** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database query builder
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Data validation

## Project Structure

```
polling-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── db/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

### Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate database schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/polling_app
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Polls
- `GET /polls` - Get all polls
- `GET /polls/:id` - Get poll details
- `POST /polls` - Create a new poll
- `DELETE /polls/:id` - Delete a poll

### Voting
- `POST /polls/:id/vote` - Submit a vote
- `GET /polls/:id/results` - Get poll results

## Real-Time Updates

The application uses Socket.IO for real-time features:
- Live poll result updates
- Vote count changes
- User activity notifications

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/aleememon/polling-app.git
   cd polling-app
   ```

2. Set up the backend (see Backend Setup above)

3. Set up the frontend (see Frontend Setup above)

4. Open [http://localhost:5173](http://localhost:5173) in your browser

5. Create an account and start creating polls!

## Scripts

### Backend
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate database schema
- `pnpm db:migrate` - Run database migrations

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

ISC

## Author

Created by [aleememon](https://github.com/aleememon)

---

For more information and live demo, visit [https://polling-app-six-lac.vercel.app](https://polling-app-six-lac.vercel.app)
