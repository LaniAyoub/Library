# Library Management System - AI Development Guide

## Architecture Overview

This is a **full-stack library management system** with:
- **Backend**: Spring Boot 3.5.7 (Java 17) REST API at `SBP1/`
- **Frontend**: React 18 + TypeScript + Vite at `front/`
- **Database**: MySQL 8.0 on port 3308, database `librarydb`

The backend exposes REST APIs consumed by the React frontend via Axios + React Query.

## Critical Setup Requirements

### Backend (Spring Boot)
```bash
cd SBP1
./mvnw spring-boot:run
# Runs on http://localhost:8080
```
- **Database credentials**: `username=library`, `password=root`, `port=3308`
- MySQL must be running BEFORE starting the backend
- Hibernate DDL auto-update creates/updates schema automatically (dev mode)

### Frontend (React)
```bash
cd front
npm install
npm run dev
# Runs on http://localhost:3000
```
- **Vite proxy** forwards `/api/*` requests to `http://localhost:8080`
- No separate API base URL config needed during development

## Data Model Patterns

### Entity Relationships (JPA)
```
Book (M:1) Author
Book (M:1) Publisher  
Book (M:N) Tag
```

**Critical**: The `Book` entity uses:
- `@ManyToOne` for Author/Publisher (required fields)
- `@ManyToMany` for Tags (optional)
- Lombok `@Getter/@Setter/@AllArgsConstructor/@NoArgsConstructor`
- Custom `toString()` to prevent circular reference issues

### DTO Pattern for Book Creation
**Always use `CreateBookRequest` DTO** (not raw `Book` entity) for POST endpoints:
```java
// DTO accepts EITHER id OR name for lookups
CreateBookRequest {
  authorId OR authorName    // Service resolves to Author entity
  publisherId OR publisherName  // Service resolves to Publisher entity
  tagIds OR tagNames        // Optional tags
}
```

The `BookService.createBook()` method:
1. Validates required fields (title, ISBN, price, quantity)
2. Checks ISBN uniqueness via `bookRepository.existsByIsbn()`
3. Resolves Author/Publisher by ID or name using repository `findByName()` queries
4. Resolves Tags similarly if provided
5. Creates and saves the `Book` entity

## API Endpoint Conventions

All book endpoints are under `/api/books` prefix:

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| GET | `/displayAllBooks` | List all books | - |
| POST | `/createBook` | Create via DTO | `CreateBookRequest` |
| GET | `/inventory?category=X` | Count books by category | - |
| PUT | `/updateBook` | Increase ALL prices by 10% | - |
| DELETE | `/DeleteBook/{isbn}` | Delete by ISBN | - |

**Note inconsistent casing**: `DeleteBook` (capitalized) vs `createBook`, `updateBook`. This is intentional per existing code.

## Frontend State Management

**React Query** (`@tanstack/react-query`) handles ALL server state:
- Query keys: `['books']`, `['inventory', category]`
- Mutations auto-invalidate queries via `queryClient.invalidateQueries()`
- No Redux, Zustand, or other state management libraries

**Axios interceptors** (`front/src/api/bookApi.ts`):
- Request: Reserved for auth tokens (currently commented out)
- Response: Transforms errors into `ApiError` type

## TypeScript Type Alignment

**Critical**: Frontend types (`front/src/types/index.ts`) must match Java DTOs exactly:
```typescript
// Frontend CreateBookRequest matches Java DTO
interface CreateBookRequest {
  authorName: string;      // Maps to BookService lookup by name
  publisherName: string;   // Maps to BookService lookup by name
  tagNames?: string[];     // Optional, maps to Tag entities
}
```

When backend DTOs change, update frontend types immediately.

## CORS Configuration

`WebConfig.java` allows `http://localhost:3000` (React dev server):
```java
.allowedOrigins("http://localhost:3000")
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
```

**For production**: Update allowed origins in `WebConfig.java` and remove Vite proxy.

## Common Development Workflows

### Adding a New API Endpoint
1. **Controller**: Add `@GetMapping/@PostMapping` in `BookController.java`
2. **Service**: Implement business logic in `BookService.java`
3. **Frontend API**: Add function in `front/src/api/bookApi.ts`
4. **Hook**: Create React Query hook in `front/src/hooks/useBookApi.ts`
5. **Type**: Update `front/src/types/index.ts` if new types needed

### Adding a New Entity Relationship
1. Add JPA annotations in entity classes (`@ManyToOne`, `@ManyToMany`)
2. Create repository interface extending `JpaRepository`
3. Update `BookService.createBook()` to resolve the new relationship
4. Add corresponding fields to `CreateBookRequest` DTO
5. Update frontend `CreateBookRequest` interface

### Debugging Database Issues
1. Check `application.properties` connection string (port 3308, not 3306)
2. Enable SQL logging: `spring.jpa.show-sql=true` (already enabled)
3. Verify Hibernate dialect: `org.hibernate.dialect.MySQLDialect`
4. Check for existing data conflicts (ISBN uniqueness)

## Project-Specific Conventions

- **Lombok**: Heavily used for entities/DTOs. Ensure Lombok plugin is configured in IDE.
- **Path aliases**: Frontend uses `@/` for `src/` imports (configured in `vite.config.ts`)
- **Index barrel exports**: Each component/page folder has `index.ts` for clean imports
- **CSS co-location**: Component styles are in same directory as component (e.g., `BookList.css` next to `BookList.tsx`)

## Key Files to Reference

- **Backend entry**: `SBP1/src/main/java/org/example/sbp1/Sbp1Application.java`
- **API contracts**: `SBP1/src/main/java/org/example/sbp1/controller/BookController.java`
- **Business logic**: `SBP1/src/main/java/org/example/sbp1/service/BookService.java`
- **Entity definitions**: `SBP1/src/main/java/org/example/sbp1/model/Book.java`
- **Frontend API layer**: `front/src/api/bookApi.ts`
- **Type definitions**: `front/src/types/index.ts`
- **API config**: `front/src/config/api.ts`
