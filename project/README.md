# EduFees Management System

A modern, React-based school fee management system built with TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Student Management**: Complete student registration and profile management
- **Fee Structure**: Configurable fee structures by class and academic year
- **Payment Processing**: Multiple payment methods with status tracking
- **Dashboard Analytics**: Real-time statistics and financial reports
- **Responsive Design**: Mobile-first approach with modern UI
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-bolt-sb1-h4ntmpbv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```

4. **Configure Supabase**
   - Create a new Supabase project
   - Get your project URL and anon key
   - Update the `.env` file with your Supabase credentials

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required: Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Application Configuration
VITE_APP_NAME=EduFees Management System
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# Optional: API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=5242880

# Optional: Payment Gateway (for future use)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here

# Optional: Email Service (for future use)
VITE_EMAIL_SERVICE_URL=your_email_service_url_here
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. Paste them in your `.env` file

## 🗄️ Database Setup

### Setting up Supabase Database

1. **Run the SQL Schema**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script to create all tables and policies

2. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable "Enable email confirmations" if you want email verification
   - Configure your site URL in the Auth settings

3. **Set up Row Level Security (RLS)**
   - The schema automatically enables RLS on all tables
   - Policies are created to control access based on user roles
   - Users can only access data they're authorized to see

### User Roles

The system supports the following user roles:
- **admin**: Full access to all features
- **accountant**: Can manage students, fees, and payments
- **clerk**: Can view and manage payments only
- **user**: Basic access (default role)

## 🚀 Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Create your first account**
   - Click "Sign up here" to create a new account
   - Fill in your details and choose your role
   - Use your credentials to log in

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard and analytics
│   ├── FeeStructure/   # Fee management
│   ├── Layout/         # Navigation and layout
│   ├── Payments/       # Payment processing
│   ├── Reports/        # Reporting and analytics
│   └── Students/       # Student management
├── config/             # Configuration files
│   └── environment.ts  # Environment variable management
├── data/               # Mock data and data utilities
├── lib/                # External library configurations
├── services/           # API services and business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Environment Management

The project uses a centralized environment configuration system:

```typescript
import { env } from './config/environment';

// Access environment variables
const supabaseUrl = env.supabase.url;
const isDebugMode = env.features.debugMode;
```

### Utility Functions

```typescript
import { 
  getRequiredEnvVar, 
  getOptionalEnvVar, 
  validateRequiredEnvVars 
} from './utils/env-helpers';

// Validate required variables
validateRequiredEnvVars(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']);
```

## 🎨 Styling

The project uses Tailwind CSS with custom component classes defined in `src/index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style
- `.input-field` - Form input style
- `.status-paid` - Payment status indicators
- `.status-pending` - Payment status indicators
- `.status-overdue` - Payment status indicators

## 📊 Database Schema

The application uses the following Supabase tables:

- `users` - User authentication and profiles
- `students` - Student information
- `fee_structures` - Fee configuration
- `fee_items` - Individual fee components
- `payments` - Payment records
- `payment_items` - Detailed payment breakdown

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel, Netlify, or any static hosting service
   - Ensure environment variables are set in your deployment platform

3. **Set up Supabase**
   - Create the required tables in your Supabase project
   - Set up Row Level Security (RLS) policies
   - Configure authentication settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your environment variables are set correctly
3. Ensure your Supabase project is properly configured
4. Check the [Issues](../../issues) page for known problems

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Bulk operations for payments
- [ ] Email notifications
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced user roles and permissions 