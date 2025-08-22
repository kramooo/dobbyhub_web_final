# DobbyHub

An AI-powered Web3 assistant platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **AI-Powered Assistants**: Multiple specialized Web3 helpers including Blockchain Educator, Crypto Researcher, Token Analyzer, and Tweet Generator
- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Beautiful UI**: Styled with MagicUI components and custom animations
- **Authentication**: Secure user authentication with Supabase
- **Real-time Chat**: Interactive chat interface with AI helpers
- **Dashboard**: Comprehensive user dashboard with quests, leaderboards, and progress tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   └── layout/         # Layout components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Additional CSS files
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: MagicUI (shadcn/ui inspired)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI Integration**: Custom AI helper system

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## License

This project is licensed under the MIT License.
