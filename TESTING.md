# Fenmo Testing Guide

## 🧪 Comprehensive Testing Scenarios

This guide covers all test scenarios to verify production readiness.

---

## ✅ **LOCAL TESTING** (Before Deployment)

### Setup

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm start
# Running on http://localhost:5000

# Terminal 2: Start Frontend  
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### Test 1: Basic Expense Creation

**Scenario**: User creates first expense

**Steps**:
1. Navigate to http://localhost:5173
2. Fill in form:
   - Amount: `250.50`
   - Category: `Food`
   - Description: `Lunch at restaurant`
   - Date: `2026-04-28`
3. Click "Submit"

**Expected**:
- ✅ Form disables during submission
- ✅ Success message appears
- ✅ Form clears
- ✅ Expense appears in list with total updated

**API Call**: `POST /api/expenses`
```json
{
  "amount": 250.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-04-28"
}
```

---

### Test 2: Idempotency (Retry Safety)

**Scenario**: User submits same expense twice (network retry)

**Steps**:
1. Create expense with idempotency_key: `unique-1`
2. Immediately submit again with same idempotency_key

**Expected**:
- ✅ First request returns 201 (created)
- ✅ Second request returns 200 (already exists)
- ✅ Only ONE expense in database
- ✅ No duplicates created

**API Testing**:
```powershell
# First submission
$body = @{
  amount = 100
  category = "Food"
  description = "Lunch"
  date = "2026-04-28"
  idempotency_key = "test-001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" `
  -Method Post -ContentType "application/json" -Body $body
# Returns 201 with new expense

# Second submission (same key)
Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" `
  -Method Post -ContentType "application/json" -Body $body
# Returns 200 with SAME expense (no duplicate!)
```

---

### Test 3: Filtering by Category

**Scenario**: User filters expenses by category

**Setup**: Create 3 expenses with different categories
- Food: 250 + 150 = 400
- Transport: 500
- Shopping: 1200

**Steps**:
1. In UI, select "Food" from category dropdown
2. Verify only Food expenses show
3. Verify total shows: `₹400.00`

**Expected**:
- ✅ Only 2 Food expenses display
- ✅ Transport & Shopping expenses hidden
- ✅ Total calculates correctly for filtered list
- ✅ Selecting "All" shows all expenses

**API Call**:
```
GET /api/expenses?category=Food
```

---

### Test 4: Sorting by Date

**Scenario**: Expenses sorted correctly (newest first)

**Setup**: Create expenses with different dates
- Date 1: 2026-04-26 (oldest)
- Date 2: 2026-04-27
- Date 3: 2026-04-28 (newest)

**Steps**:
1. View expense list
2. Verify order: newest (04-28) appears first

**Expected**:
- ✅ Expenses ordered: 04-28, 04-27, 04-26 (descending)
- ✅ Can toggle to ascending if implemented
- ✅ Correct sorting maintained after filtering

**API Call**:
```
GET /api/expenses?sort=date_desc  # Newest first
GET /api/expenses?sort=date_asc   # Oldest first
```

---

### Test 5: Form Validation

**Scenario**: User tries invalid inputs

#### Test 5a: Negative Amount
- **Input**: Amount = `-100`
- **Expected**: ❌ Error message "Amount must be positive"
- **API Response**: 400 Bad Request

#### Test 5b: Missing Amount
- **Input**: Category filled, amount empty
- **Expected**: ❌ Form won't submit or shows error
- **API Response**: 400 Bad Request

#### Test 5c: Missing Category
- **Input**: Amount filled, category empty
- **Expected**: ❌ Form won't submit
- **API Response**: 400 Bad Request

#### Test 5d: Missing Date
- **Input**: Amount and category filled, date empty
- **Expected**: ❌ Form won't submit
- **API Response**: 400 Bad Request

---

### Test 6: Page Reload Persistence

**Scenario**: User reloads page - data persists

**Steps**:
1. Create 3 expenses
2. Verify they appear in list with correct total
3. Press `F5` to refresh page
4. Verify ALL expenses still visible

**Expected**:
- ✅ Data persists after refresh
- ✅ No data loss
- ✅ Total recalculates correctly
- ✅ Categories dropdown updated

---

### Test 7: Error Handling

**Scenario**: Backend is down

**Steps**:
1. Stop backend server (Ctrl+C in terminal)
2. Try to create expense or fetch list
3. Verify UI shows error message

**Expected**:
- ✅ Error message displays clearly
- ✅ "Retry" button works
- ✅ No app crashes
- ✅ Start backend, retry works

---

### Test 8: Loading States

**Scenario**: User sees loading indicator during API calls

**Steps**:
1. Slow down network (Chrome DevTools → Network → Slow 3G)
2. Create expense
3. Watch for loading state

**Expected**:
- ✅ Submit button shows loading state
- ✅ "Creating..." or spinner visible
- ✅ Button disabled during submission
- ✅ State clears after response

---

### Test 9: Edge Cases

#### Test 9a: Very Large Amount
- **Input**: `999999999.99`
- **Expected**: ✅ Accepted and stored correctly

#### Test 9b: Very Long Description
- **Input**: 500+ characters
- **Expected**: ✅ Trimmed or accepted

#### Test 9c: Special Characters in Category
- **Input**: `Food & Drinks`
- **Expected**: ✅ Stored and filtered correctly

#### Test 9d: Same Date Multiple Expenses
- **Input**: 3 expenses on 2026-04-28
- **Expected**: ✅ All visible, correctly sorted by creation time

---

### Test 10: Total Calculation

**Scenario**: Verify total calculation accuracy

**Setup**: Create these expenses:
- 100.50
- 200.75
- 99.25

**Expected Total**: 400.50

**Steps**:
1. Create all 3 expenses
2. Verify total shows: `₹400.50`
3. Filter to show 2 expenses
4. Verify total updates to: `₹301.25`

---

## ✅ **PRODUCTION TESTING** (After Deployment)

### Test 11: Live Backend Health Check

```powershell
# Test 1: Health endpoint
curl https://fenmo-backend.render.com/api/health
# Expected: { "status": "Backend is running" }

# Test 2: Get expenses (new database)
curl https://fenmo-backend.render.com/api/expenses
# Expected: { "expenses": [] }

# Test 3: Create expense
$body = @{
  amount = 150
  category = "Test"
  description = "Production test"
  date = "2026-04-28"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://fenmo-backend.render.com/api/expenses" `
  -Method Post -ContentType "application/json" -Body $body
# Expected: 201 Created with expense data
```

---

### Test 12: Frontend Production Tests

**Setup**: Open frontend in browser

```
https://fenmo-frontend.vercel.app
```

**Steps**:
1. **Load Time**: ✅ Page loads in < 3 seconds
2. **Styling**: ✅ All styles apply correctly
3. **API Connection**: ✅ Can create and fetch expenses
4. **Mobile**: ✅ Works on mobile (DevTools responsive mode)
5. **Dark Mode**: ✅ (If implemented)

---

### Test 13: Cross-Browser Compatibility

**Test in**:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

**Verify**:
- ✅ Form works in all browsers
- ✅ Styling consistent
- ✅ API calls succeed
- ✅ No console errors

---

### Test 14: Network Resilience

**Scenario**: Simulate network issues

**Tools**: Chrome DevTools → Network tab

#### Test 14a: Slow Network (3G)
1. Set throttling to "Slow 3G"
2. Create expense
3. Verify UI shows loading state
4. Verify success after delay

#### Test 14b: Offline Then Online
1. Go offline
2. Try to create expense
3. Show error message
4. Go online
5. Click "Retry"
6. Verify success

#### Test 14c: Connection Timeout
1. Set network throttling to connection drops
2. Create expense
3. Verify error handling
4. Retry after reconnection works

---

### Test 15: Concurrent Requests

**Scenario**: Multiple rapid submissions

```powershell
# Rapid fire requests
for ($i = 1; $i -le 5; $i++) {
  $body = @{
    amount = $i * 100
    category = "Bulk Test"
    description = "Request $i"
    date = "2026-04-28"
  } | ConvertTo-Json
  
  Invoke-RestMethod -Uri "https://fenmo-backend.render.com/api/expenses" `
    -Method Post -ContentType "application/json" -Body $body
}

# Verify all 5 created
curl https://fenmo-backend.render.com/api/expenses
# Should have exactly 5 "Bulk Test" expenses
```

---

### Test 16: Data Integrity

**Scenario**: Verify stored data correctness

**Steps**:
1. Create expense: Amount `99.99`, Category `Food`
2. Fetch via API
3. Verify stored amount is exactly `99.99` (not `99.989999...`)
4. Verify no data corruption

---

## 📊 **TEST RESULTS TEMPLATE**

```markdown
## Test Results - [Date]

### Environment
- Backend: [URL]
- Frontend: [URL]
- Browser: [Chrome/Firefox/etc]
- Device: [Desktop/Mobile]

### Test Summary
| Test | Status | Notes |
|------|--------|-------|
| Basic Creation | ✅ | Works perfectly |
| Idempotency | ✅ | Duplicate prevention working |
| Filtering | ✅ | Category filter accurate |
| Sorting | ✅ | Date sorting correct |
| Validation | ✅ | All validations working |
| Page Reload | ✅ | Data persists |
| Error Handling | ✅ | Shows user-friendly errors |
| Loading States | ✅ | UI feedback present |
| Edge Cases | ✅ | Large amounts handled |
| Total Calc | ✅ | Accurate calculations |
| Health Check | ✅ | API responsive |
| Production | ✅ | Live URL working |
| Cross-Browser | ✅ | Consistent across browsers |
| Network Issues | ✅ | Handles offline gracefully |
| Concurrent | ✅ | Multiple requests work |
| Data Integrity | ✅ | No corruption |

### Issues Found
None - All tests passed! ✅

### Deployment Date
[When deployed to production]
```

---

## 🚀 **AUTOMATED TESTING** (Optional Future Enhancement)

### Unit Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests (Cypress/Playwright)
```bash
npm run test:e2e
```

---

## ✅ **FINAL VERIFICATION CHECKLIST**

Before marking as production-ready:

- [ ] All 16 tests completed
- [ ] No critical bugs found
- [ ] Error handling verified
- [ ] API response times acceptable (< 500ms)
- [ ] Frontend load time acceptable (< 3s)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility confirmed
- [ ] Data persistence verified
- [ ] Network resilience validated
- [ ] User feedback (loading/errors) clear

---

**✅ Once all tests pass, Fenmo is production-ready!**
