# Timeshare Petition Platform

A React application for creating and sharing timeshare petitions.

## Features

- Create new petitions with title, story, and assessed value
- Share petitions on social media platforms
- Track petition signatures with progress bar
- Sign petitions with user information
- Real-time signature counting

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd timeshare-petition
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database with the following tables:

### petitions table
```sql
create table petitions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  story text not null,
  assessed_value numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  signature_count integer default 0,
  goal integer default 1000
);
```

### signatures table
```sql
create table signatures (
  id uuid default uuid_generate_v4() primary key,
  petition_id uuid references petitions(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5. Start the development server:
```bash
npm run dev
```

## Usage

1. Visit the homepage to create a new petition
2. Fill in the petition details
3. Share the petition using social media buttons or copy the link
4. Share the link with others to collect signatures

## Technologies Used

- React
- TypeScript
- Material-UI
- Supabase
- React Router # ePSF-Petition-Final
