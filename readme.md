# UNIPORT CS Alumni Management System

**A comprehensive, single-page application designed to manage, track, and analyze alumni data for the University of Port Harcourt Computer Science department. This system provides a modern, intuitive interface for administrators to interact with alumni records and for alumni to connect with each other.**

---

### **Programmer:** Igboeche Johnfavour Ikenna
- **Phone:** 08169849839
- **Email:** [igboechejohn@gmail.com](mailto:igboechejohn@gmail.com)

---

## ✨ Key Features

This application is packed with features to provide a seamless and powerful user experience:

-   **📊 Interactive Dashboard**: At-a-glance view of key metrics such as total alumni, degree distribution, active users, and graduation trends with animated cards and charts.
-   **👤 Alumni Records Management**: Full CRUD (Create, Read, Update, Delete) functionality for alumni profiles, managed through an intuitive modal interface.
-   **🔍 Advanced Filtering & Sorting**: Easily search, filter, and sort alumni records by various criteria like name, graduation year, company, degree, and active status. Includes grid and list view modes.
-   **📈 Data Analytics**: A dedicated analytics page with visualizations on salary distributions (average, highest, lowest), geographic locations, and top employers.
-   **💬 Community Feed**: An Instagram-style social feed where alumni can post updates, and engage with each other through likes and comments in a familiar social media format.
-   **✉️ Private Messaging**: A WhatsApp-like real-time chat interface for one-on-one conversations. Features include typing indicators, voice notes, and unread message counters.
-   **📰 Newsletter Composer**: A rich text editor to compose and send targeted newsletters to specific segments of the alumni network based on filters. Includes a live preview feature.
-   **📱 Responsive Design**: A fully responsive layout that works seamlessly across desktop, tablet, and mobile devices, with a dedicated mobile sidebar for navigation.
-   **🌙 Dark Mode**: A sleek, eye-friendly dark mode for better user experience in low-light environments, with a simple toggle in the navigation bar.
-   **🔔 Toast Notifications**: Non-intrusive feedback for user actions like adding, updating, or deleting records, ensuring a smooth user experience.

## 🛠️ Tech Stack

The project leverages a modern, lightweight tech stack focused on performance and developer experience without requiring a complex build setup.

-   **Frontend Library**: [React 19](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Module Loading**: Native ES Modules with `importmap` (No build step required)

## 🚀 How to Run

This project is set up to run directly in the browser without any build tools like Vite or Webpack.

1.  **Download or Clone**: Get all the project files and place them in a single directory.
2.  **Open in Browser**: Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, Safari, or Edge) that supports `importmap`.
3.  **That's it!** The application will load and be ready to use.

## 📁 File Structure

The project is organized logically to separate concerns and make navigation easy.

```
.
├── index.html          # Main HTML entry point with importmap setup
├── index.tsx           # React application root and rendering logic
├── App.tsx             # Main application component, handles state, routing, and modals
├── types.ts            # Centralized TypeScript type definitions
├── constants.ts        # Mock data for alumni, posts, conversations, etc.
├── metadata.json       # Application metadata (e.g., permissions)
├── package.json        # Project details and scripts (for deployment)
├── components/         # Directory for all React components
│   ├── AlumniModal.tsx      # Modal for viewing, adding, and editing alumni
│   ├── AlumniRecords.tsx    # Page component for managing alumni data
│   ├── Analytics.tsx        # Page component for data visualization
│   ├── Community.tsx        # Social feed component
│   ├── Dashboard.tsx        # Main dashboard component
│   ├── DeleteConfirmModal.tsx # Confirmation modal for deletions
│   ├── icons.ts             # Centralized export for lucide-react icons
│   ├── Messages.tsx         # Private messaging interface
│   ├── MobileSidebar.tsx    # Navigation sidebar for mobile screens
│   ├── Navigation.tsx       # Main top navigation bar
│   ├── Newsletter.tsx       # Newsletter creation and sending UI
│   └── Toast.tsx            # Notification pop-up component
└── readme.md           # This file
```

## 📞 Contact

For any inquiries, feedback, or collaboration opportunities, please contact:

**Igboeche Johnfavour Ikenna**
-   **Email:** [igboechejohn@gmail.com](mailto:igboechejohn@gmail.com)
-   **Phone:** 08169849839
