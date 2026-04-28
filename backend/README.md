# Fenmo - Personal Finance Expense Tracker

A production-ready full-stack expense tracking application built with Node.js backend and React frontend.

## 📋 Project Overview

**Fenmo** is a minimal yet robust personal finance tool that allows users to:
- Record personal expenses with amount, category, description, and date
- View all expenses in a sorted list
- Filter expenses by category  
- See total amount of filtered expenses
- Handle real-world network conditions (retries, page reloads, slow responses)

## 🎯 Design Principles

The project is built with a focus on **production-quality depth** rather than feature breadth:
- **Correctness**: Proper handling of money (decimal precision)
- **Resilience**: Idempotency to handle network retries safely
- **User Experience**: Graceful handling of errors and loading states
- **Code Quality**: Clean, maintainable architecture

## 🏗️ Backend Architecture

### Tech Stack
- **Framework**: Express.js (Node.js)
- **Database**: SQLite (via sql.js for pure JavaScript implementation)
- **Language**: JavaScript (Node.js)
- **Database Persistence**: File-based SQLite database (`expenses.db`)

### Why sql.js?
- Pure JavaScript implementation - no native module compilation needed
- Works reliably cross-platform without build tools (Python, Visual Studio, etc.)
- SQLite-compatible for easy database inspection
- File-based persistence for simplicity

### API Endpoints

#### POST `/api/expenses`
Create a new expense entry.

**Request Body:**
```json
{
  "amount": 150.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-04-28",
  "idempotency_key": "optional-unique-key"  // For retry safety
}
```

**Response (201 Created):**
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": "uuid",
    "amount": 150.50,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2026-04-28",
    "created_at": "2026-04-28T14:29:51.655Z"
  }
}
```

**Idempotency**: The `idempotency_key` ensures that the same expense isn't created twice if submitted multiple times due to network issues.

#### GET `/api/expenses`
Retrieve all expenses with optional filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category (e.g., `?category=Food`)
- `sort` (optional): Sort by date - `date_desc` (newest first, default) or `date_asc` (oldest first)

**Response (200 OK):**
```json
{
  "expenses": [
    {
      "id": "uuid",
      "amount": 150.50,
      "category": "Food",
      "description": "Lunch",
      "date": "2026-04-28",
      "created_at": "2026-04-28T14:29:51.655Z"
    }
  ]
}
```

### Database Schema

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  idempotency_key TEXT UNIQUE
);
```

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables (.env):**
```
PORT=5000
NODE_ENV=development
```

3. **Start the backend server:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Testing Endpoints

```bash
# Create an expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "category": "Food", "description": "Lunch", "date": "2026-04-28"}'

# Get all expenses
curl http://localhost:5000/api/expenses

# Filter by category
curl "http://localhost:5000/api/expenses?category=Food"

# Sort by date (oldest first)
curl "http://localhost:5000/api/expenses?sort=date_asc"
```

## 🔑 Key Features

### 1. **Robust Idempotency** ✅
- Duplicate POST requests with the same `idempotency_key` return the same result
- Safely handles network retries without creating duplicate entries

### 2. **Production Data Handling** ✅
- Amounts stored as REAL (decimal precision) for money handling
- Proper validation (positive amounts, required fields)
- ISO 8601 timestamps for consistency

### 3. **Error Handling** ✅
- Comprehensive validation
- Meaningful error messages
- Proper HTTP status codes

### 4. **Database Persistence** ✅
- SQLite file-based database (`expenses.db`)
- Automatic table creation on first run
- Data survives application restarts

## 📊 Data Correctness

- **Money Handling**: Amounts stored as REAL (floating-point) for financial data
- **Dates**: Stored in ISO 8601 format (YYYY-MM-DD)
- **Timestamps**: Created_at in ISO 8601 with timezone (UTC)
- **Categories**: Simple string categorization
- **IDs**: UUID v4 for globally unique identifiers

## 🔧 Development Notes

### Idempotency Implementation
The backend provides idempotency by:
1. Accepting an optional `idempotency_key` in POST requests
2. Checking if the key already exists in the database
3. If found, returning the previously created expense
4. If not found, creating the expense and storing the key

This approach ensures that:
- Client can safely retry failed requests
- Network issues don't cause duplicate entries
- User experience remains smooth despite connectivity problems

## 📝 Future Enhancements (Not Implemented)
- User authentication
- Custom categories management
- Budget alerts
- Expense reports and analytics
- Recurring expenses
- Multi-currency support

## 🎓 Tech Decisions

### Why sql.js over regular SQLite?
- **Simplicity**: No build tool requirements
- **Cross-platform**: Works on Windows, Mac, Linux without compilation
- **File Persistence**: Still maintains `.db` file for data durability
- **Production Ready**: Widely used in production Node.js applications

### Why Idempotency?
The requirement to "handle retries" is critical for production systems:
- Networks are unreliable
- Browsers can hang or disconnect
- Users may click buttons multiple times
- Idempotency keys make the system resilient

### API Design Choices
- **RESTful endpoints**: Standard HTTP methods for CRUD operations
- **Query parameters for filtering**: Simple, cacheable, standard pattern
- **JSON format**: Universal data exchange format
- **Proper status codes**: 201 for creation, 400 for validation errors, 500 for server errors

## 📦 Dependencies

- **express**: Web framework for Node.js
- **sql.js**: SQLite in JavaScript
- **uuid**: Unique ID generation
- **body-parser**: JSON parsing middleware
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## 📄 License

MIT
