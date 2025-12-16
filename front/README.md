# Book Management Frontend

A React + TypeScript frontend application for managing a book inventory system, built to work with a Java Spring Boot backend.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **React Query (TanStack Query)** - Powerful data fetching and state management
- **Axios** - HTTP client for API requests
- **CSS Modules** - Scoped styling

## 📁 Project Structure

```
src/
├── api/                 # API client functions
│   └── bookApi.ts      # Book-related API calls
├── components/         # Reusable UI components
│   └── Layout/         # Main app layout with navigation
├── config/            # Configuration files
│   └── api.ts         # API endpoints and base URL config
├── hooks/             # Custom React hooks
│   └── useBookApi.ts  # React Query hooks for book operations
├── pages/             # Page-level components
│   ├── BookList/      # Display all books
│   ├── CreateBook/    # Add new book form
│   ├── Inventory/     # Category inventory search
│   └── PriceUpdate/   # Bulk price update
├── types/             # TypeScript type definitions
│   └── index.ts       # All types and interfaces
├── App.tsx            # Main app component with routing
├── App.css            # Global styles
└── main.tsx           # Application entry point
```

## 🛠️ Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Java backend running on `http://localhost:8080` (or configure the base URL)

### Installation Steps

1. **Clone and navigate to the project:**
   ```bash
   cd front
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API base URL (if needed):**
   
   Edit `src/config/api.ts` to change the backend URL:
   ```typescript
   const API_BASE_URL = 'http://your-backend-url:port';
   ```

   Or set environment variable:
   ```bash
   # .env.local
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🔌 API Integration

The frontend is designed to work with these backend endpoints:

### Book Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books/displayAllBooks` | Get all books |
| `POST` | `/api/books/createBook` | Create new book (via DTO) |
| `POST` | `/api/books/saveBook` | Save book (direct entity) |
| `GET` | `/api/books/inventory?category=X` | Get book count by category |
| `PUT` | `/api/books/updateBook` | Update all prices by 10% |
| `DELETE` | `/api/books/DeleteBook/{isbn}` | Delete book by ISBN |

### Data Models

The frontend expects these data structures from your backend:

```typescript
interface Book {
  id?: number;
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  category: string;
  author: {
    id?: number;
    name: string;
    email?: string;
  };
  publisher: {
    id?: number;
    name: string;
    address?: string;
  };
  tags?: Array<{
    id?: number;
    name: string;
  }>;
}
```

## 📱 Features

### 📚 Book List Page (`/books`)
- Display all books in a responsive table
- Delete books by ISBN
- Refresh data
- Show book details including category, author, publisher, price, and quantity
- Low stock indicator for books with quantity < 5

### ➕ Create Book Page (`/books/new`)
- Form to add new books
- Input validation
- Support for author, publisher, and tags
- Category selection
- Price and quantity validation

### 📊 Inventory Page (`/inventory`)
- Search book count by category
- Category dropdown selection
- Real-time count display
- Refresh functionality

### 💰 Price Update Page (`/admin/price-update`)
- Bulk update all book prices by 10%
- Confirmation dialog
- Success/error handling
- Detailed information about the update process

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Form Validation** - Client-side validation with error messages
- **Modern Design** - Clean, professional interface
- **Accessibility** - Keyboard navigation and screen reader support

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Proxy Configuration

The Vite config includes a proxy for development:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

This allows you to make API calls to `/api/*` during development without CORS issues.

## 🚀 Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your static hosting service (Netlify, Vercel, Apache, Nginx, etc.)

3. **Configure environment variables** on your hosting platform:
   - `REACT_APP_API_BASE_URL`: Your production backend URL

4. **Ensure your backend allows CORS** for your frontend domain.

## 🤝 Integration with Java Backend

### Expected Java Backend Setup

Your Java backend should have these dependencies and setup:

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Other dependencies... -->
</dependencies>
```

### CORS Configuration

Add CORS configuration to your Spring Boot application:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // Add your frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **API calls failing with CORS errors:**
   - Ensure CORS is configured on your backend
   - Check that the API base URL is correct

2. **Page not found on refresh:**
   - Configure your web server to serve `index.html` for all routes
   - For development, Vite handles this automatically

3. **Build errors:**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript errors: `npm run lint`

4. **Backend connection issues:**
   - Verify backend is running on `http://localhost:8080`
   - Check network tab in browser dev tools for API call errors

## 📝 License

This project is created for educational/demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy coding! 🚀**
