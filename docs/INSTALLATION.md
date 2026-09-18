# ZAYATHON 2026 - Installation & Local Setup Guide

## System Requirements
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

## Getting Started

1. **Clone the Repository**
```bash
git clone https://github.com/rajeshkumarmahato2063-wq/cyber-tech-nation.git
cd cyber-tech-nation
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Launch Local Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build Production Bundle**
```bash
npm run build
```
