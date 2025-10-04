# News Aggregator

A full-stack news aggregation service that fetches articles from multiple sources, providing a REST API and React frontend with intelligent caching and rate limiting.

## Features

### Backend

- Aggregates news from multiple sources:
  - [NewsAPI](https://newsapi.org/)
  - [The Guardian API](https://open-platform.theguardian.com/)
- Intelligent caching system using LRU cache
- MongoDB integration with deduplication
- Background job to refresh articles every 30 minutes
- REST API with pagination, search and filtering
- API rate limiting with exponential backoff
- Comprehensive test coverage

### Frontend

- Modern React app built with Vite
- Real-time article search with debouncing
- Category filtering
- Responsive article grid layout
- Client-side caching via React Query
- Loading states and error handling
- Back navigation and original source links

## Tech Stack

- **Frontend**: React, TanStack Router, TanStack Query, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Testing**: Vitest
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose _(optional)_
- MongoDB _(MongoDB Atlas preferred)_
- Node.js v20+
- API keys for:
  - [NewsAPI](https://newsapi.org/)
  - [The Guardian](https://open-platform.theguardian.com/)

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Create `.env` file in server directory:

```env
PORT=3001
NEWS_API_KEY=your_news_api_key
GUARDIAN_API_KEY=your_guardian_api_key
MONGODB_URI=your_mongodb_uri
```

### Running Application with Docker

#### Development Mode

Run the application in development mode with hot-reloading:

```bash
docker compose up
```

The following services will be available:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

#### Production Mode

Run the application in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build
```

The following services will be available:

- Frontend: http://localhost
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

#### Stopping the Application

```bash
# Development
docker compose down

# Production
docker compose -f docker-compose.prod.yml down
```

To remove all data (including MongoDB data):

```bash
docker compose down -v
```

### Running Development Locally

1. Start MongoDB:

```bash
docker compose up mongodb -d
```

2. Start backend:

```bash
cd server
npm install
npm run dev
```

3. Start frontend:

```bash
cd web
npm install
npm run dev
```

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

## Architecture

### Caching Strategy

1. **Backend Caching**:

- In-memory LRU cache for API responses
- Configurable TTL per endpoint
- Automatic cache invalidation on new article ingestion
- MongoDB query optimization

2. **Frontend Caching**:

- React Query cache with configurable stale time
- Automatic background refetching
- Cache invalidation on mutations

### API Rate Limiting

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

### Frontend Tests

```bash
cd web
npm test
```

## Project Structure

```
├── server/                # Backend Node.js server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   └── tests/
├── web/                   # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── routes/       # Route components
│   │   ├── lib/         # Utilities
│   │   └── hooks/       # Custom hooks
│   └── tests/
└── docker-compose.yml    # Docker configuration
```

## Development

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Backend
cd server
npm run lint

# Frontend
cd web
npm run lint
```

### Adding New Features

1. **New API Endpoint**:

- Add route in `server/src/routes`
- Create controller in `server/src/controllers`
- Add tests in `__test__` directory

2. **New Frontend Feature**:

- Add route in `web/src/routes`
- Create components in `web/src/components`
- Add tests for components

## Production Deployment

The application is containerized and ready for production deployment:

- Multi-stage Docker builds for optimal image size
- Nginx reverse proxy for frontend
- Environment variable injection
- Health checks and automatic restarts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
