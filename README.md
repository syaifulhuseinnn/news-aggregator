# News Aggregator

A full-stack news aggregation service that fetches articles from multiple sources (NewsAPI and The Guardian), implements intelligent caching, and provides a clean React frontend.

## Features

### Backend

- Multi-source news aggregation:
  - NewsAPI integration
  - The Guardian API integration
- Intelligent caching system:
  - LRU in-memory cache
  - Configurable TTL per endpoint
  - Automatic cache invalidation
- MongoDB integration with deduplication
- Background job to refresh articles every 30 minutes
- API rate limiting with exponential backoff
- Comprehensive test coverage

### Frontend

- Modern React SPA with Vite
- Real-time article search with debouncing
- Category filtering
- Pagination with memory caching
- Article detail view
- Loading states and error handling
- Clean UI with Tailwind CSS

## Tech Stack

### Backend

- Node.js with TypeScript
- Express.js
- MongoDB
- LRU Cache
- Node-cron
- Jest/Vitest for testing

### Frontend

- React
- TanStack Router
- TanStack Query
- Tailwind CSS
- Vitest

## Getting Started

### Prerequisites

- Node.js v20+
- Docker and Docker Compose
- API Keys:
  - [NewsAPI](https://newsapi.org/)
  - [The Guardian](https://open-platform.theguardian.com/)

### Running with Docker

1. Clone the repository

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Create `.env` file in root directory:

```env
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
```

3. Start all services:

```bash
docker compose up --build
```

The following services will be available:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

### Running Locally

1. Clone the repository

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

**Backend**

1. Start MongoDB container:

```bash
docker compose up mongodb -d
```

2. Environment setup

```bash
cd server
```

Create `.env` file in server directory

```env
PORT=3001
NEWS_API_KEY=your_news_api_key
GUARDIAN_API_KEY=your_guardian_api_key
MONGODB_URI=your_mongodb_uri
```

2. Start backend:

```bash
cd server
npm install
npm run dev
```

Backend accessible via http://localhost:3001

**Frontend**

1. Environment setup

```bash
cd web
```

Create `.env` file in web directory

```env
VITE_BASE_URL_API=http://localhost:3001
```

3. Start frontend:

```bash
cd web
npm install
npm run dev
```

Frontend accessible via http://localhost:3000

## API Documentation

### Endpoints

#### `GET /api/articles`

Get paginated list of articles.

Query parameters:

- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `category` (optional)
- `search` (optional)

Response:

```json
{
  "page": 1,
  "limit": 10,
  "total": 100,
  "items": [
    {
      "_id": "...",
      "title": "Article Title",
      "summary": "Article Summary",
      "content": "Full article content",
      "url": "Original article URL",
      "imageUrl": "Article image URL",
      "publishedAt": "2024-01-01T00:00:00Z",
      "source": "guardian",
      "categories": ["technology"],
      "authors": ["Author Name"]
    }
  ]
}
```

#### `GET /api/articles/:id`

Get single article by ID.

#### `GET /api/categories`

Get list of available categories.

> **Assumption**
> I assume endpoint `/api/health` means get articles from health category. Since `/api/articles` has capability to get articles by category by add query param, I don't create endpoint `/api/health`

## Architecture

### Caching Strategy

#### Backend Caching

- In-memory LRU cache for API responses
- Configurable TTL per endpoint
- Automatic cache invalidation on new article ingestion
- MongoDB query optimization

#### Frontend Caching

- React Query for data synchronization
- Configurable stale time
- Background refetching
- Optimistic updates

### Rate Limiting

- Exponential backoff with jitter
- Configurable retry attempts
- Proper error handling

### Article Deduplication

- Content hash generation using title + source + date
- MongoDB unique index on hash
- Upsert operations for atomic updates

## Testing

### Backend Tests

```bash
cd server
npm test
```

Tests cover:

- Article ingestion
- API endpoints
- Cache behavior
- Rate limiting
- Error handling

### Frontend Tests

```bash
cd web
npm test
```

Tests cover:

- Component rendering
- User interactions
- API integration
- Error states
