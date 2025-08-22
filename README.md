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
- Supabase account (for database and authentication)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/kramooo/dobbyhub_web_final.git
cd dobbyhub
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Set up the database:**
- Follow the instructions in `DATABASE_SETUP.md`
- Run the SQL scripts in the `database/` folder in your Supabase SQL editor
- Follow `DOBBY_HELPERS_SETUP.md` to set up the AI helpers

5. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Environment Setup

The project requires several setup files to be configured:

- **Database Setup**: See `DATABASE_SETUP.md` and `DATABASE_CHAT_SETUP.md`
- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Dobby Helpers**: See `DOBBY_HELPERS_SETUP.md`

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

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## License

This project is licensed under the MIT License.
