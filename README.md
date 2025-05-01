# Aucta

(Work in Progress)

Aucta is a web platform for hosting and participating in real-time auctions. You can create auctions with start and end dates, provide a URL to an image of what you're auctioning, place bids, and see realtime updates to the bid price on the bid page!

## Features

- Firebase Authentication
- Protected user profiles
- Material UI components for a modern interface
- Server-side rendering for secure content
- Responsive design

## Tech Stack

- [Next.js](https://nextjs.org) with App Router
- [React](https://react.dev)
- [Firebase](https://firebase.google.com) for authentication and database
- [Material UI](https://mui.com) for component styling
- [TypeScript](https://www.typescriptlang.org)

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or a package manager of your choice)
- Firebase project (for authentication and database)

### Environment Setup

Create a `.env.local` file with your Firebase configuration:

```
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Config (for server-side authentication)
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

```bash
# Format code with Prettier
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```
