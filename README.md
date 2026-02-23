# Agnos Health Assignment

A real-time patient input form and staff monitoring system built with Next.js, Socket.IO, and TailwindCSS.

## 🚀 Overview

The Agnos Health Assignment is a comprehensive web application that enables patients to fill out medical forms in real-time while allowing staff to monitor their progress instantly. The system features real-time synchronization, form validation, and a modern, responsive interface.

## ✨ Key Features

- **Real-time Synchronization**: Live updates between patient forms and staff dashboard using WebSocket technology
- **Responsive Design**: Mobile-first approach with TailwindCSS for optimal viewing on all devices
- **Form Validation**: Client-side validation with instant feedback
- **Patient Status Tracking**: Real-time status indicators (filling, inactive, submitted)
- **Modern UI/UX**: Clean, professional interface with smooth transitions and animations
- **Unique Patient IDs**: Clean, readable patient identification system

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Socket.IO Client**: Real-time client-side communication

### Backend
- **Node.js**: JavaScript runtime
- **Socket.IO**: Real-time WebSocket server
- **Express**: Web application framework

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📁 Project Structure

```
agnos-health-assignment/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home/landing page
│   ├── patient/page.tsx         # Patient form page
│   ├── staff/page.tsx           # Staff dashboard
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # Reusable React components
│   ├── providers/              # Context providers
│   │   └── SocketProvider.tsx  # Socket.IO context
│   └── ui/                     # UI components
├── lib/                        # Utility libraries
│   └── types.ts               # TypeScript type definitions
├── public/                     # Static assets
│   └── common-page-background.webp  # Background image
├── server.js                   # Socket.IO server
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agnos-health-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Application Flow

### Patient Experience
1. Patient accesses the patient form page
2. A unique patient ID is generated (format: `P-XXXXX-XXXX`)
3. Patient fills out the comprehensive medical form
4. Real-time validation provides instant feedback
5. Form data is synchronized live with staff dashboard
6. Patient can submit the completed form

### Staff Experience
1. Staff accesses the dashboard
2. View all active patients in real-time
3. Monitor patient form progress as they type
4. See patient status changes (filling → inactive → submitted)
5. View complete patient details after submission
6. Track patient activity timestamps

## 🔄 Real-time Architecture

### Socket.IO Events

#### Patient Events
- `patient:join` - Patient joins the session
- `patient:field_update` - Real-time form field updates
- `patient:status_change` - Patient status changes
- `patient:submit` - Form submission

#### Staff Events
- `staff:join` - Staff joins the monitoring session
- `staff:field_updated` - Receive field updates
- `staff:status_updated` - Receive status changes
- `staff:patient_joined` - New patient notification
- `staff:form_submitted` - Form submission notification
- `staff:patient_left` - Patient departure notification

### Data Flow
1. Patient form changes → Socket.IO emit → Server broadcast → Staff dashboard update
2. Debounced field updates (50ms) to prevent excessive network traffic
3. Automatic inactivity detection (3-second timeout)
4. Real-time status synchronization across all connected clients

## 🎨 UI/UX Features

### Design System
- Consistent color scheme with blue/indigo gradients
- Modern card-based layouts
- Smooth transitions and micro-interactions
- Status indicators with color coding
- Responsive typography and spacing

### Accessibility
- Semantic HTML structure
- Proper form labels and ARIA attributes
- Keyboard navigation support
- High contrast text for readability
- Mobile-responsive design

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
PORT=3000
```

### Socket.IO Server Configuration
The server runs on port 3001 by default and handles:
- CORS configuration for Next.js client
- Room-based patient isolation
- Real-time event broadcasting
- Connection management and cleanup

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set `NODE_ENV=production` for optimal performance
- Configure proper CORS origins for production domains
- Set up process monitoring (PM2 recommended)
- Configure reverse proxy (nginx/Apache) if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the deployment planning documentation or contact the development team.

---

**Built with ❤️ using Next.js, Socket.IO, and TailwindCSS**
