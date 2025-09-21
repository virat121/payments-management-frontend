# FinFlow - Modern Financial Management System

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vuex-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vuex" />
</div>

<div align="center">
  <h3>🚀 Live Demo</h3>
  <p>
    <a href="https://virat121.github.io/payments-management-frontend/">
      <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages" />
    </a>
    <a href="https://finflow-quf2c2f3w-sauravs-projects-884baa5d.vercel.app/">
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    </a>
  </p>
</div>

---

## 📋 **Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 **Overview**

FinFlow is a modern, responsive financial management system built for fintech startups. It provides a comprehensive solution for managing users and payment flows with advanced traceability, reporting, and analytics capabilities.

### **Key Highlights**
- 🎨 **Modern UI/UX** - Industry-standard design with Tailwind CSS
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🔒 **Type-Safe** - Built with TypeScript for robust development
- ⚡ **Fast Performance** - Vite-powered build system
- 🧪 **Well Tested** - Comprehensive test coverage with Vitest
- 🚀 **Production Ready** - Deployed on GitHub Pages and Vercel

---

## ✨ **Features**

### **👥 User Management**
- **User List** - View all users with advanced filtering and search
- **User Creation** - Add new users with role-based permissions
- **User Editing** - Update user information and status
- **Role Management** - Admin, User, and Manager roles
- **Status Control** - Active/Inactive user management

### **💳 Payment Management**
- **Payment List** - Comprehensive payment overview with filters
- **Payment Details** - Detailed payment information and timeline
- **Payment Creation** - Create new payments with validation
- **Payment Editing** - Update payment status and information
- **Advanced Filtering** - Filter by status, category, amount, and date
- **Smart Sorting** - ID-based sorting for consistent ordering

### **📊 Financial Dashboard**
- **Real-time Analytics** - Key financial metrics and KPIs
- **Interactive Charts** - Payment status overview and trends
- **Smart Number Formatting** - K, M, B suffixes for large numbers
- **Currency Support** - USD, EUR, GBP, INR with correct symbols
- **Recent Transactions** - Latest payment activities

### **🎨 UI/UX Features**
- **Modern Design System** - Consistent colors, typography, and spacing
- **Responsive Layout** - Mobile-first design approach
- **Interactive Components** - Hover effects, animations, and transitions
- **Accessibility** - ARIA roles, keyboard navigation, and color contrast
- **Dark Mode Ready** - Prepared for theme switching

---

## 🛠 **Tech Stack**

### **Frontend**
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Vue Router** - Client-side routing
- **Vuex** - State management

### **Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Design System** - Industry-standard color palette
- **Responsive Design** - Mobile-first approach
- **Custom Components** - Reusable UI components

### **Testing**
- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Vue component testing utilities
- **JSDOM** - DOM environment for testing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 **Project Structure**

```
finflow/
├── public/                 # Static assets
│   ├── vite.svg           # Favicon
│   └── 404.html           # SPA fallback for GitHub Pages
├── src/
│   ├── assets/            # Static assets (images, icons)
│   ├── components/        # Reusable Vue components
│   │   ├── BaseCard.vue   # Card component
│   │   ├── BaseTable.vue  # Table component
│   │   ├── ConfirmDialog.vue # Confirmation dialog
│   │   ├── Navbar.vue     # Navigation bar
│   │   ├── Pagination.vue # Pagination component
│   │   ├── Select.vue     # Custom select dropdown
│   │   ├── Sidebar.vue    # Main sidebar
│   │   ├── StatusBadge.vue # Status badge component
│   │   ├── TextInput.vue  # Custom text input
│   │   └── Toast.vue      # Toast notification
│   ├── router/            # Vue Router configuration
│   │   └── index.ts       # Route definitions
│   ├── services/          # API services
│   │   └── currencyService.ts # Currency exchange service
│   ├── store/             # Vuex store
│   │   ├── index.ts       # Store configuration
│   │   └── modules/       # Store modules
│   │       ├── payments.ts # Payment state management
│   │       └── users.ts   # User state management
│   ├── tests/             # Test files
│   │   ├── CoreComponents.spec.ts
│   │   ├── FormValidation.spec.ts
│   │   ├── PaymentDetail.spec.ts
│   │   ├── PaymentForm.spec.ts
│   │   └── PaymentList.spec.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Global types
│   ├── utils/             # Utility functions
│   │   └── currency.ts    # Currency formatting utilities
│   ├── views/             # Page components
│   │   ├── Dashboard.vue  # Main dashboard
│   │   ├── FinancialDashboard.vue # Financial analytics
│   │   ├── PaymentDetail.vue # Payment details page
│   │   ├── PaymentForm.vue # Payment form
│   │   ├── PaymentList.vue # Payment list page
│   │   ├── UserForm.vue   # User form
│   │   └── UserList.vue   # User list page
│   ├── App.vue            # Root component
│   ├── main.ts            # Application entry point
│   └── style.css          # Global styles
├── .github/
│   └── workflows/         # GitHub Actions
│       ├── deploy.yml     # GitHub Pages deployment
│       ├── deploy-vercel.yml # Vercel deployment
│       ├── deploy-netlify.yml # Netlify deployment
│       └── deploy-pages.yml # Alternative GitHub Pages
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
└── package.json           # Dependencies and scripts
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/virat121/payments-management-frontend.git
   cd payments-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
# Build for GitHub Pages
npm run build:github

# Build for Vercel
npm run build:vercel

# Build for local preview
npm run build
```

---

## 📜 **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:github` | Build for GitHub Pages |
| `npm run build:vercel` | Build for Vercel |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Run TypeScript linter |
| `npm run type-check` | Check TypeScript types |

---

## 🧪 **Testing**

The project includes comprehensive test coverage for critical components:

### **Test Coverage**
- **Core Components** - Dashboard, PaymentList, PaymentDetail
- **Form Validation** - PaymentForm, UserForm validation logic
- **Component Rendering** - UI component rendering tests
- **User Interactions** - Form submissions and navigation

### **Running Tests**
```bash
# Run all tests
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### **Test Files**
- `src/tests/CoreComponents.spec.ts` - Core component tests
- `src/tests/FormValidation.spec.ts` - Form validation tests
- `src/tests/PaymentDetail.spec.ts` - Payment detail tests
- `src/tests/PaymentForm.spec.ts` - Payment form tests
- `src/tests/PaymentList.spec.ts` - Payment list tests

---

## 🚀 **Deployment**

### **GitHub Pages**
The project is automatically deployed to GitHub Pages on every push to the main branch.

**Live URL**: https://virat121.github.io/payments-management-frontend/

### **Vercel**
Deploy to Vercel with zero configuration:

1. **Connect Repository**: Import `virat121/payments-management-frontend`
2. **Deploy**: Vercel automatically detects the build settings
3. **Custom Domain**: Optionally add your custom domain

**Live URL**: https://finflow-quf2c2f3w-sauravs-projects-884baa5d.vercel.app/

### **Manual Deployment**

#### **GitHub Pages**
```bash
npm run build:github
# Deploy dist/ folder to GitHub Pages
```

#### **Vercel**
```bash
npm run build:vercel
# Deploy dist/ folder to Vercel
```

#### **Netlify**
```bash
npm run build
# Deploy dist/ folder to Netlify
```

---

## 📚 **API Documentation**

### **Mock Data Structure**

#### **User Object**
```typescript
interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

#### **Payment Object**
```typescript
interface Payment {
  id: string
  amount: number
  currency: Currency
  status: PaymentStatus
  category: PaymentCategory
  direction: PaymentDirection
  payerId: string
  payeeId: string
  description: string
  createdAt: string
  updatedAt: string
}
```

### **Enums**
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR'
}
```

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write tests for new features
- Ensure responsive design
- Follow the existing code style
- Update documentation as needed

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Vue.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite Team** - For the fast build tool
- **Chart.js** - For the charting library
- **Heroicons** - For the beautiful icons

---

## 📞 **Support**

If you have any questions or need help:

- **GitHub Issues**: [Create an issue](https://github.com/virat121/payments-management-frontend/issues)

---
