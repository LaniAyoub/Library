# 🚀 Quick Start Guide

## Prerequisites

### Required Software
- ✅ Java 17 or higher
- ✅ Node.js 16+ and npm
- ✅ MySQL 8.0 running on port 3308
- ✅ Git (optional)

### Database Setup
```sql
-- Run these commands in MySQL:
CREATE DATABASE IF NOT EXISTS librarydb;
CREATE USER IF NOT EXISTS 'library'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON librarydb.* TO 'library'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🏃 Running the Application

### Option 1: Two Terminal Windows

#### Terminal 1 - Backend (Spring Boot)
```bash
cd SBP1
./mvnw spring-boot:run
```
Wait for: `Started Sbp1Application in X seconds`

#### Terminal 2 - Frontend (React)
```bash
cd front
npm install        # First time only
npm run dev
```
Wait for: `Local: http://localhost:3000/`

### Option 2: PowerShell Script (Windows)
```powershell
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd SBP1; ./mvnw spring-boot:run"

# Frontend (wait 10 seconds for backend to start)
Start-Sleep -Seconds 10
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd front; npm run dev"
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main Application |
| **Backend API** | http://localhost:8080/api | REST API |
| **MySQL** | localhost:3308 | Database |

---

## 📋 First Steps After Launch

### 1. Add Some Authors
1. Navigate to http://localhost:3000/authors
2. Click "+ Add New Author"
3. Enter name and email
4. Click "Create Author"

**Example Authors:**
- J.K. Rowling (jk@example.com)
- George R.R. Martin (george@example.com)
- Stephen King (stephen@example.com)

### 2. Add Some Publishers
1. Navigate to http://localhost:3000/publishers
2. Click "+ Add New Publisher"
3. Enter name and address

**Example Publishers:**
- Penguin Random House (375 Hudson St, New York, NY)
- HarperCollins (195 Broadway, New York, NY)
- Simon & Schuster (1230 Avenue of the Americas, New York, NY)

### 3. Add Your First Book
1. Navigate to http://localhost:3000/books/new
2. Fill in the form:
   - **Title**: "Harry Potter and the Philosopher's Stone"
   - **ISBN**: "12-345-678"
   - **Price**: 19.99
   - **Quantity**: 50
   - **Category**: Fiction
   - **Author Name**: "J.K. Rowling"
   - **Publisher Name**: "Penguin Random House"
3. Click "Create Book"

### 4. Try the Search Feature
1. Navigate to http://localhost:3000/search
2. Select search type (Title/Author/ISBN/Category)
3. Enter your query
4. Click "Search"

---

## 🧪 Test the Features

### ✅ Book Management
- [ ] View all books
- [ ] Add a new book
- [ ] Delete a book
- [ ] See low stock warning (add book with quantity < 5)

### ✅ Search Functionality
- [ ] Search by title (try "Harry")
- [ ] Search by author (try "Rowling")
- [ ] Search by ISBN (try exact match)
- [ ] Search by category (try "Fiction")

### ✅ Author Management
- [ ] View all authors
- [ ] Add new author
- [ ] Delete an author
- [ ] See empty state (delete all authors)

### ✅ Publisher Management
- [ ] View all publishers
- [ ] Add new publisher
- [ ] Delete a publisher

### ✅ Inventory Check
- [ ] Go to /inventory
- [ ] Select a category
- [ ] Click "Check Inventory"
- [ ] View count

### ✅ Price Update
- [ ] Go to /admin/price-update
- [ ] Click "Update All Prices"
- [ ] Confirm the action
- [ ] See updated prices in book list

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `Cannot connect to database`
```bash
# Check MySQL is running
mysql -u library -p -h localhost -P 3308

# If connection fails, check:
1. MySQL service is running
2. Port 3308 is correct (not 3306)
3. User 'library' exists with correct password
```

**Error**: `Port 8080 already in use`
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Frontend Won't Start

**Error**: `EADDRINUSE: address already in use :::3000`
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Error**: `Module not found`
```bash
# Clean install
cd front
rm -rf node_modules package-lock.json
npm install
```

### API Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Check WebConfig.java has correct allowedOrigins
- Restart backend after changes

**Error**: `404 Not Found on API calls`
- Verify backend is running on port 8080
- Check API_BASE_URL in front/src/config/api.ts

### Build Errors

**Error**: TypeScript compilation errors
```bash
cd front
npm run build
# Read error messages carefully
# Check imports match exported names
```

---

## 📊 Sample Data Script

Create a file `sample-data.sql`:
```sql
USE librarydb;

-- Sample Authors
INSERT INTO author (name, email) VALUES 
('J.K. Rowling', 'jk.rowling@example.com'),
('George R.R. Martin', 'george@example.com'),
('Stephen King', 'stephen@example.com'),
('Agatha Christie', 'agatha@example.com'),
('Isaac Asimov', 'isaac@example.com');

-- Sample Publishers
INSERT INTO publisher (name, adress) VALUES
('Penguin Random House', '375 Hudson Street, New York, NY 10014'),
('HarperCollins', '195 Broadway, New York, NY 10007'),
('Simon & Schuster', '1230 Avenue of the Americas, New York, NY 10020'),
('Hachette Book Group', '1290 Avenue of the Americas, New York, NY 10104'),
('Macmillan Publishers', '120 Broadway, New York, NY 10271');

-- Sample Books (adjust IDs based on your auto-increment)
INSERT INTO books (title, isbn, price, quantity, category, author_id, publisher_id) VALUES
('Harry Potter and the Philosopher''s Stone', '12-345-678', 19.99, 50, 'Fiction', 1, 1),
('A Game of Thrones', '23-456-789', 29.99, 35, 'Fiction', 2, 2),
('The Shining', '34-567-890', 24.99, 20, 'Horror', 3, 3),
('Murder on the Orient Express', '45-678-901', 14.99, 40, 'Mystery', 4, 4),
('Foundation', '56-789-012', 22.99, 30, 'Science Fiction', 5, 5);
```

Run it:
```bash
mysql -u library -p -P 3308 librarydb < sample-data.sql
```

---

## 🎯 Common Tasks

### Clear All Data
```sql
USE librarydb;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE book_tag;
TRUNCATE TABLE books;
TRUNCATE TABLE author;
TRUNCATE TABLE publisher;
TRUNCATE TABLE tag;
SET FOREIGN_KEY_CHECKS = 1;
```

### Backup Database
```bash
mysqldump -u library -p -P 3308 librarydb > backup.sql
```

### Restore Database
```bash
mysql -u library -p -P 3308 librarydb < backup.sql
```

### View Logs
```bash
# Backend logs
cd SBP1
tail -f target/spring.log

# Frontend console
# Open browser DevTools (F12) → Console tab
```

---

## 🎨 Customization

### Change Color Theme
Edit `front/src/App.css` and `front/src/components/Layout/Layout.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Change Port Numbers
- **Backend**: Edit `SBP1/src/main/resources/application.properties`
- **Frontend**: Edit `front/vite.config.ts` (server.port)

### Add New Category
In `front/src/pages/CreateBook/CreateBook.tsx`:
```tsx
<option value="YourCategory">Your Category</option>
```

---

## 📚 Helpful Commands

```bash
# Check if MySQL is running
mysql --version
mysqladmin -u root -p ping

# Check Java version
java --version

# Check Node version
node --version
npm --version

# Clean backend build
cd SBP1
./mvnw clean

# Clean frontend build
cd front
rm -rf node_modules dist
npm install

# Production build
cd front
npm run build
# Output in dist/ folder
```

---

## 🎉 You're Ready!

Your Library Management System is now running with:
- ✅ Modern UI with purple gradient theme
- ✅ Full CRUD for Books, Authors, and Publishers
- ✅ Advanced search functionality
- ✅ Responsive design for all devices
- ✅ Professional animations and effects

**Enjoy managing your library! 📚✨**

---

## 📞 Need Help?

- Check `IMPLEMENTATION_COMPLETE.md` for full feature list
- See `VISUAL_GUIDE.md` for UI/UX details
- Read `.github/copilot-instructions.md` for development guide
- Review `FEATURE_UPDATE.md` for technical details
