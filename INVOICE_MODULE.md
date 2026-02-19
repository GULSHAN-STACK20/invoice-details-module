# Invoice Module Documentation

## Overview

The Invoice Module is a complete invoicing system built with the MERN stack that allows users to manage invoices, line items, and payments. The module is designed with a clean, professional UI inspired by modern invoice management systems.

## Features

✅ **Complete Invoice Management**
- Create and view detailed invoices
- Track invoice status (DRAFT, PAID)
- Archive and restore invoices
- View invoice history

✅ **Line Items**
- Multiple line items per invoice
- Automatic line total calculation (quantity × unit price)
- Detailed item descriptions

✅ **Payment Tracking**
- Add payments to invoices
- Track payment history
- Automatic balance calculation
- Prevent overpayment
- Auto-update status to PAID when fully paid

✅ **Business Rules Implementation**
- Line Total = Quantity × Unit Price
- Total = Sum of all line totals
- Balance Due = Total - Amount Paid
- Payment validation (no overpayment)
- Status auto-update on full payment

---

## Architecture

### Backend (Server)

#### Models

**1. Invoice Model** (`server/models/Invoice.js`)
```javascript
{
  invoiceNumber: String (unique, required),
  customerName: String (required),
  issueDate: Date (required, default: Date.now),
  dueDate: Date (required),
  status: 'DRAFT' | 'PAID' (default: 'DRAFT'),
  total: Number (required, default: 0),
  amountPaid: Number (default: 0),
  balanceDue: Number (default: 0),
  isArchived: Boolean (default: false)
}
```

**2. InvoiceLine Model** (`server/models/InvoiceLine.js`)
```javascript
{
  invoiceId: ObjectId (ref: 'Invoice', required),
  description: String (required),
  quantity: Number (required, min: 1),
  unitPrice: Number (required, min: 0),
  lineTotal: Number (required)
}
```
- Pre-save hook: Automatically calculates `lineTotal = quantity × unitPrice`

**3. Payment Model** (`server/models/Payment.js`)
```javascript
{
  invoiceId: ObjectId (ref: 'Invoice', required),
  amount: Number (required, min: 0),
  paymentDate: Date (required, default: Date.now)
}
```

#### API Endpoints

**GET /api/invoices**
- Get all invoices
- Query params: `?archived=true` to get archived invoices
- Response: Array of invoices

**GET /api/invoices/:id**
- Get complete invoice details
- Returns: invoice, lineItems, payments, total, amountPaid, balanceDue
- Status: 200 OK | 404 Not Found | 500 Server Error

**POST /api/invoices**
- Create a new invoice with line items
- Body:
  ```json
  {
    "invoiceNumber": "INV-2024-001",
    "customerName": "John Doe",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "lineItems": [
      {
        "description": "Service Description",
        "quantity": 2,
        "unitPrice": 100.00
      }
    ]
  }
  ```
- Status: 201 Created | 400 Bad Request

**POST /api/invoices/:id/payments**
- Add a payment to an invoice
- Body:
  ```json
  {
    "amount": 500.00,
    "paymentDate": "2024-01-20"
  }
  ```
- Business Rules:
  - Amount must be > 0
  - Amount must be ≤ balanceDue
  - Updates invoice.amountPaid
  - Updates invoice.balanceDue
  - Updates status to PAID if balanceDue = 0
- Status: 201 Created | 400 Bad Request | 404 Not Found

**POST /api/invoices/:id/archive**
- Archive an invoice
- Sets `isArchived = true`
- Status: 200 OK | 404 Not Found | 500 Server Error

**POST /api/invoices/:id/restore**
- Restore an archived invoice
- Sets `isArchived = false`
- Status: 200 OK | 404 Not Found | 500 Server Error

---

### Frontend (Client)

#### Pages

**1. Invoices List** (`/invoices`)
- Component: `client/src/pages/Invoices.js`
- Features:
  - Display all invoices in a grid layout
  - Filter by archived status
  - Click to view invoice details
  - Status badges (DRAFT, PAID, ARCHIVED)
  - Shows key information: invoice number, customer, dates, amounts

**2. Invoice Details** (`/invoices/:id`)
- Component: `client/src/pages/InvoiceDetails.js`
- Sections:
  - **Header**: Invoice number, customer name, status badge
  - **Invoice Info**: Issue date, due date
  - **Line Items Table**: Description, quantity, unit price, line total
  - **Totals Section**: Total, amount paid, balance due
  - **Payments Section**: Payment history with add payment button
  - **Actions**: Archive/Restore button

#### Components

**AddPaymentModal** (`client/src/components/AddPaymentModal.js`)
- Modal form for adding payments
- Features:
  - Amount input with validation
  - Payment date selector
  - Shows balance due
  - Prevents overpayment
  - Error handling
  - Loading states

---

## UI Design

### Design Principles

The UI is inspired by modern invoice management systems with:
- **Clean Layout**: White background with subtle shadows
- **Professional Typography**: Clear hierarchy with different font sizes
- **Color Coding**:
  - Blue: Primary actions
  - Green: Paid status, successful payments
  - Yellow: Draft status
  - Red: Balance due, unpaid amounts
  - Gray: Archived items
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Interactive Elements**: Hover effects, smooth transitions
- **Clear Visual Hierarchy**: Important information stands out

### Color Scheme

```css
Primary: #3498db (Blue)
Success: #00b894 (Green)
Warning: #fdcb6e (Yellow)
Danger: #e74c3c (Red)
Neutral: #95a5a6 (Gray)
Text: #2c3e50 (Dark Blue-Gray)
Background: #f8f9fa (Light Gray)
```

---

## Setup and Usage

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Make sure MongoDB is running

# Seed sample invoice data
node seedInvoices.js
```

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

### 3. Access the Invoice Module

1. Start both backend and frontend servers
2. Open browser to `http://localhost:3000`
3. Click "Invoices" in the navigation bar
4. View the list of invoices
5. Click on any invoice to see details

---

## Testing Guide

### Manual Testing Checklist

#### Invoice List
- [ ] View all active invoices
- [ ] Toggle to view archived invoices
- [ ] Click on invoice card to view details
- [ ] Verify status badges display correctly
- [ ] Check responsive design on mobile

#### Invoice Details
- [ ] View invoice header with correct information
- [ ] Verify line items display correctly
- [ ] Check totals section calculations
- [ ] View payment history
- [ ] Verify archived badge shows for archived invoices

#### Add Payment
- [ ] Click "Add Payment" button
- [ ] Enter valid payment amount
- [ ] Select payment date
- [ ] Submit payment successfully
- [ ] Verify payment appears in list
- [ ] Check that totals update correctly
- [ ] Verify status changes to PAID when fully paid

#### Payment Validation
- [ ] Try to add payment with amount = 0 (should fail)
- [ ] Try to add payment > balance due (should fail)
- [ ] Try to add payment to fully paid invoice (button should not show)
- [ ] Verify error messages display correctly

#### Archive/Restore
- [ ] Archive an invoice
- [ ] Verify "ARCHIVED" badge appears
- [ ] Check invoice appears in archived filter
- [ ] Restore the invoice
- [ ] Verify invoice returns to active list

### API Testing with curl

```bash
# Get all invoices
curl http://localhost:5000/api/invoices

# Get invoice details
curl http://localhost:5000/api/invoices/{invoice_id}

# Add payment
curl -X POST http://localhost:5000/api/invoices/{invoice_id}/payments \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "paymentDate": "2024-01-25"}'

# Archive invoice
curl -X POST http://localhost:5000/api/invoices/{invoice_id}/archive

# Restore invoice
curl -X POST http://localhost:5000/api/invoices/{invoice_id}/restore
```

---

## Business Logic Implementation

### 1. Line Total Calculation
```javascript
// Automatic in InvoiceLine model pre-save hook
lineTotal = quantity × unitPrice
```

### 2. Invoice Total Calculation
```javascript
// Sum of all line items' lineTotals
total = sum(lineItems.map(item => item.lineTotal))
```

### 3. Balance Due Calculation
```javascript
// Automatic in Invoice model pre-save hook
balanceDue = total - amountPaid
```

### 4. Payment Validation
```javascript
// Enforced in POST /api/invoices/:id/payments
if (amount <= 0) {
  return error("Amount must be greater than 0")
}
if (amount > invoice.balanceDue) {
  return error("Payment amount cannot exceed balance due")
}
```

### 5. Status Auto-Update
```javascript
// After payment is added
invoice.amountPaid += payment.amount
invoice.balanceDue = invoice.total - invoice.amountPaid

if (invoice.balanceDue === 0) {
  invoice.status = 'PAID'
}
```

---

## Extension Ideas

While the core requirements are complete, here are potential enhancements:

### Authentication (Plus Point)
- Add user authentication with JWT
- Restrict invoice access by user
- Role-based permissions (admin, user)

### PDF Generation (Plus Point)
- Generate PDF invoices
- Download invoice as PDF
- Email invoice to customers

### Tax Logic (Plus Point)
- Add tax rate field
- Calculate tax amount
- Show subtotal, tax, and total

### Multi-Currency (Plus Point)
- Support multiple currencies
- Currency conversion
- Display currency symbol

### Overdue Logic (Plus Point)
- Highlight overdue invoices
- Calculate days overdue
- Send reminders for overdue payments

### Advanced Features
- Invoice editing
- Line item editing
- Payment refunds
- Invoice templates
- Recurring invoices
- Email notifications
- Search and filtering
- Export to CSV/Excel
- Dashboard with statistics

---

## File Structure

```
server/
├── models/
│   ├── Invoice.js          # Invoice model
│   ├── InvoiceLine.js      # Line item model
│   └── Payment.js          # Payment model
├── routes/
│   └── invoices.js         # Invoice API routes
├── seedInvoices.js         # Seed script for sample data
└── server.js               # Server entry (includes invoice routes)

client/
├── src/
│   ├── components/
│   │   ├── AddPaymentModal.js      # Payment modal component
│   │   ├── AddPaymentModal.css     # Payment modal styles
│   │   └── Navbar.js               # Navigation (includes invoice link)
│   ├── pages/
│   │   ├── Invoices.js             # Invoice list page
│   │   ├── Invoices.css            # Invoice list styles
│   │   ├── InvoiceDetails.js       # Invoice details page
│   │   └── InvoiceDetails.css      # Invoice details styles
│   └── App.js                      # App routes (includes invoice routes)
```

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: Cannot connect to MongoDB
```
Solution: Ensure MongoDB is running and MONGODB_URI is correct in server/.env

**2. Invoice Not Loading**
```
Error: Invoice not found
```
Solution: Check that you've seeded the database with `node seedInvoices.js`

**3. Payment Not Adding**
```
Error: Payment amount cannot exceed balance due
```
Solution: Ensure payment amount is less than or equal to balance due

**4. Frontend Not Connecting to Backend**
```
Error: Network Error
```
Solution: 
- Check backend is running on port 5000
- Verify proxy in client/package.json
- Check CORS settings in server

**5. Styling Issues**
Solution:
- Clear browser cache
- Check that CSS files are imported
- Verify no conflicting global styles

---

## Summary

The Invoice Module provides a complete invoicing solution with:

✅ **Backend**: 3 MongoDB models, full RESTful API with 6 endpoints
✅ **Frontend**: 2 pages (list and details), 1 modal component
✅ **Business Rules**: All calculations and validations implemented
✅ **UI**: Clean, professional design inspired by modern invoice systems
✅ **Testing**: Sample data seeding for easy testing

The module follows best practices:
- Clean code architecture
- RESTful API design
- React component composition
- Responsive design
- Error handling
- Input validation
- Business logic enforcement

---

**Ready for production use with potential for enhancement with authentication, PDF generation, and more advanced features!**
