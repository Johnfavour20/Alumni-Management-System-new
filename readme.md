# Alumni Management System

A comprehensive, single-page application designed to manage, track, and analyze alumni data for the University of Port Harcourt Computer Science department. This system provides a modern, intuitive interface for administrators to interact with alumni records and for alumni to connect with each other.

## Features

-   **Interactive Dashboard**: At-a-glance view of key metrics such as total alumni, degree distribution, active users, and graduation trends.
-   **Alumni Records Management**: Full CRUD (Create, Read, Update, Delete) functionality for alumni profiles.
-   **Advanced Filtering & Sorting**: Easily search, filter, and sort alumni records by various criteria like name, graduation year, company, and more.
-   **Data Analytics**: A dedicated analytics page with visualizations on salary distributions, geographic locations, and top employers.
-   **Community Feed**: An Instagram-style social feed where alumni can post updates, and engage with each other through likes and comments.
-   **Private Messaging**: A WhatsApp-like real-time chat interface for one-on-one conversations between users.
-   **Responsive Design**: A fully responsive layout that works seamlessly across desktop, tablet, and mobile devices.
-   **Dark Mode**: A sleek, eye-friendly dark mode for better user experience in low-light environments.
-   **Toast Notifications**: Non-intrusive feedback for user actions like adding, updating, or deleting records.

## Tech Stack

-   **React 19**: For building the user interface with modern features.
-   **TypeScript**: For static typing and improved code quality.
-   **Tailwind CSS**: For utility-first styling and rapid UI development.
-   **Lucide React**: For a beautiful and consistent set of icons.
-   **No Build Step**: Utilizes a single `index.html` with an `importmap` to load ES modules directly in the browser, simplifying the development setup.

## How to Run

This project is set up to run without any build tools like Vite or Webpack.

1.  Ensure all the files are in the same directory.
2.  Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge) that supports `importmap`.

The application will load and be ready to use.

## File Structure

```
.
├── index.html          # Main HTML entry point
├── index.tsx           # React application root
├── App.tsx             # Main application component, handles state and routing
├── types.ts            # TypeScript type definitions for the application
├── constants.ts        # Mock data and constants
├── metadata.json       # Application metadata
├── components/         # Directory for all React components
│   ├── AlumniModal.tsx
│   ├── AlumniRecords.tsx
│   ├── Analytics.tsx
│   ├── Community.tsx
│   ├── Dashboard.tsx
│   ├── DeleteConfirmModal.tsx
│   ├── icons.ts        # Exports lucide-react icons
│   ├── Messages.tsx
│   ├── MobileSidebar.tsx
│   ├── Navigation.tsx
│   └── Toast.tsx
└── readme.md           # This file
```