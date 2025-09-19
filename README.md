# CFO Helper Agent 🏢

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/2os-projects/v0-remix-of-cfo-helper-agent)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Y2EqjZZ77Yz)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

> **AI-powered financial planning and analysis tool designed specifically for Indian businesses with advanced scenario modeling, real-time cash flow projections, and intelligent insights.**

## 🚀 Live Demo

**[https://vercel.com/2os-projects/v0-remix-of-cfo-helper-agent](https://vercel.com/2os-projects/v0-remix-of-cfo-helper-agent)**

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CFO Helper Agent is a comprehensive financial planning platform that empowers Indian businesses with data-driven decision making. Built with modern web technologies and powered by AI, it provides real-time financial analysis, scenario planning, and executive reporting capabilities.

### Why CFO Helper Agent?

- **Indian Business Context**: Proper INR formatting with lakhs/crores notation
- **AI-Powered Insights**: Google Gemini 2.5 Flash integration for intelligent analysis
- **Real-time Collaboration**: Live updates and scenario sharing
- **Executive Ready**: Professional PDF reports and presentations
- **Secure & Scalable**: Built on Supabase with Row Level Security

## ✨ Key Features

### 📊 **Financial Dashboard**
- **Interactive Metrics Cards**: Revenue, expenses, profit margin, and cash runway tracking
- **Real-time Charts**: Revenue projections, expense breakdowns, and cash flow analysis
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Visual Health Indicators**: Color-coded status badges for financial health

### 🎛️ **Scenario Manager**
- **Multi-scenario Planning**: Create, edit, duplicate, and delete financial scenarios
- **Interactive Controls**: Real-time sliders for key financial parameters
- **Preset Templates**: Conservative Growth, Aggressive Expansion, and Steady State
- **Custom Scenarios**: Save personalized scenarios with AI-suggested names
- **Health Scoring**: Automatic risk assessment (Healthy/Moderate/Risk)

### 🤖 **AI-Powered Analytics**
- **Real-time Insights**: Live analysis as you adjust parameters
- **Smart Naming**: AI suggests meaningful scenario names
- **Executive Summaries**: Automated business report generation
- **Change Impact Analysis**: Instant feedback on financial adjustments
- **Market Context**: Insights tailored for Indian business conditions

### 📈 **Financial Modeling**
- **Cash Flow Projections**: 12-month forward-looking analysis
- **Runway Calculations**: Burn rate analysis and survival metrics
- **Growth Modeling**: Revenue and expense scaling scenarios
- **Profitability Analysis**: Margin tracking and optimization insights

### 📄 **Export & Reporting**
- **PDF Generation**: Professional executive reports
- **Scenario Comparison**: Side-by-side analysis capabilities
- **Usage Analytics**: Track scenario modifications and insights
- **Data Export**: Structured data for external analysis

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling
- **shadcn/ui** - High-quality component library
- **Recharts** - Data visualization and charting

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **Google Gemini 2.5 Flash** - AI-powered insights generation
- **Row Level Security** - User data isolation and privacy

### **Infrastructure**
- **Vercel** - Deployment and hosting platform
- **Supabase Auth** - User authentication and session management
- **Real-time Subscriptions** - Live data synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/cfo-helper-agent.git
   cd cfo-helper-agent
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Database Configuration
   POSTGRES_URL=your_postgres_connection_string
   
   # AI Integration
   GEMINI_API_KEY=your_google_ai_api_key
   
   # Development
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Run the SQL scripts in order
   npm run db:setup
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
cfo-helper-agent/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── analytics/            # Usage tracking endpoints
│   │   ├── insights/             # AI-powered analysis
│   │   ├── scenarios/            # Scenario CRUD operations
│   │   ├── reports/              # Report generation
│   │   └── export-pdf/           # PDF export functionality
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard page
│   ├── globals.css               # Global styles and design tokens
│   └── layout.tsx                # Root layout component
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard-client.tsx      # Main dashboard container
│   ├── scenario-manager.tsx      # Scenario management interface
│   ├── controls-panel.tsx        # Financial parameter controls
│   ├── insights-panel.tsx        # AI insights display
│   ├── metrics-cards.tsx         # Key metrics visualization
│   ├── cash-flow-chart.tsx       # Cash flow projections
│   ├── revenue-chart.tsx         # Revenue analysis
│   ├── runway-meter.tsx          # Cash runway visualization
│   └── pdf-export.tsx            # Export functionality
├── lib/                          # Utility functions
│   ├── types.ts                  # TypeScript type definitions
│   ├── utils.ts                  # Common utilities
│   ├── supabase/                 # Database client configuration
│   └── indian-formatter.ts       # INR formatting utilities
├── scripts/                      # Database setup scripts
│   ├── 001_create_scenarios_table.sql
│   ├── 002_create_usage_tracking.sql
│   └── 005_create_user_profiles.sql
└── hooks/                        # Custom React hooks
    ├── use-mobile.tsx            # Mobile detection
    └── use-toast.ts              # Toast notifications
\`\`\`

## 🗄️ Database Schema

### **scenarios** table
\`\`\`sql
- id: uuid (Primary Key)
- user_id: uuid (Foreign Key)
- name: text
- revenue: numeric
- expenses: numeric
- growth_rate: numeric
- burn_rate: numeric
- cash_on_hand: numeric
- created_at: timestamp with time zone
- updated_at: timestamp with time zone
\`\`\`

### **user_profiles** table
\`\`\`sql
- id: uuid (Primary Key)
- company_name: text
- display_name: text
- industry: text
- created_at: timestamp with time zone
- updated_at: timestamp with time zone
\`\`\`

### **usage_tracking** table
\`\`\`sql
- id: uuid (Primary Key)
- user_id: uuid (Foreign Key)
- scenario_id: uuid (Foreign Key)
- action: text
- metadata: jsonb
- timestamp: timestamp with time zone
\`\`\`

## 🔌 API Endpoints

### **Scenarios Management**
- `GET /api/scenarios` - List user scenarios
- `POST /api/scenarios` - Create new scenario
- `GET /api/scenarios/[id]` - Get specific scenario
- `PUT /api/scenarios/[id]` - Update scenario
- `DELETE /api/scenarios/[id]` - Delete scenario

### **Analytics & Insights**
- `POST /api/insights` - Generate AI-powered insights
- `GET /api/analytics` - Get usage statistics
- `POST /api/analytics` - Track user actions

### **Reports & Export**
- `GET /api/reports` - Generate financial reports
- `POST /api/export-pdf` - Create PDF exports

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `POSTGRES_URL` | PostgreSQL connection string | ✅ |
| `GEMINI_API_KEY` | Google AI API key | ✅ |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Development redirect URL | 🔧 |

## 📖 Usage Guide

### **Creating Your First Scenario**

1. **Sign up/Login** to access the dashboard
2. **Set up your profile** with company details
3. **Choose a preset scenario** or create custom parameters
4. **Adjust financial inputs** using the interactive controls
5. **Review AI insights** and health scoring
6. **Save your scenario** with a meaningful name
7. **Export reports** for presentations or analysis

### **Understanding Health Scores**

- **🟢 Healthy (80-100)**: Strong profitability and long runway
- **🟡 Moderate (50-79)**: Stable but requires monitoring
- **🔴 Risk (0-49)**: Immediate attention needed

### **Scenario Planning Best Practices**

1. **Start with Conservative**: Use conservative growth assumptions
2. **Model Multiple Cases**: Create optimistic, realistic, and pessimistic scenarios
3. **Regular Updates**: Refresh scenarios monthly with actual data
4. **Focus on Runway**: Monitor cash runway closely for sustainability
5. **Use AI Insights**: Leverage AI recommendations for strategic decisions

## 🤝 Contributing

We welcome contributions to improve CFO Helper Agent! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) - AI-powered development platform
- Powered by [Supabase](https://supabase.com) - Open source Firebase alternative
- UI components from [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- Charts powered by [Recharts](https://recharts.org) - Composable charting library
- AI insights from [Google Gemini](https://ai.google.dev) - Advanced language model

---

**Built with ❤️ for Indian businesses by the v0 community**

*For support or questions, please open an issue or contact the development team.*
