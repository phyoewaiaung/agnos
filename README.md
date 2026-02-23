# Agnos Health Assignment

Real-time patient form system with staff monitoring.

## Features

- **Real-time Sync**: Live form updates between patients and staff
- **Compact Design**: Optimized UI for efficient data entry
- **Modular Architecture**: Clean, reusable components
- **TypeScript**: Type-safe development
- **Responsive**: Mobile-first design

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Node.js, Socket.IO
- **Real-time**: WebSocket communication

## Quick Start

```bash
# Install
npm install

# Development
npm run dev

# Production
npm run build
npm start
```

Visit `http://localhost:3000`

## Pages

- `/` - Home portal
- `/patient` - Patient form
- `/staff` - Staff dashboard

## Architecture

```
components/
├── forms/          # Form components
├── ui/             # UI library
└── providers/      # Context providers

hooks/              # Custom hooks
utils/              # Helper functions
lib/                # TypeScript types
```

## Socket Events

**Patient → Server**
- `patient:join` - Join patient room
- `patient:field_update` - Form field changes
- `patient:status_change` - Status updates
- `patient:submit` - Form submission

**Server → Staff**
- `staff:patient_joined` - New patient
- `staff:field_updated` - Field updates
- `staff:status_updated` - Status changes
- `staff:form_submitted` - Form completed

## Key Components

### FormField
Reusable form input with validation and real-time sync.

### StatusBadge
Compact status indicators with animations.

### usePatientForm
Custom hook for patient form state management.

### useStaffDashboard
Custom hook for staff dashboard real-time updates.

## Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure

Compact, modular design with:
- Separated concerns
- Reusable components
- Custom hooks
- Utility functions
- TypeScript interfaces

---

**Built with ❤️ using Next.js, Socket.IO, and TailwindCSS**
