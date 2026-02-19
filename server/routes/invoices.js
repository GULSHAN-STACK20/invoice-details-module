const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const InvoiceLine = require('../models/InvoiceLine');
const Payment = require('../models/Payment');

// GET /api/invoices/:id - Get invoice details with line items and payments
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Get line items
    const lineItems = await InvoiceLine.find({ invoiceId: req.params.id });

    // Get payments
    const payments = await Payment.find({ invoiceId: req.params.id }).sort({ paymentDate: -1 });

    res.json({
      invoice,
      lineItems,
      payments,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/invoices/:id/payments - Add payment to invoice
router.post('/:id/payments', async (req, res) => {
  try {
    const { amount, paymentDate } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Get invoice
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if amount exceeds balance due
    if (amount > invoice.balanceDue) {
      return res.status(400).json({ 
        message: 'Payment amount cannot exceed balance due',
        balanceDue: invoice.balanceDue
      });
    }

    // Create payment
    const payment = new Payment({
      invoiceId: req.params.id,
      amount,
      paymentDate: paymentDate || Date.now()
    });
    await payment.save();

    // Update invoice
    invoice.amountPaid += amount;
    
    // Update status if fully paid
    if (invoice.balanceDue === 0) {
      invoice.status = 'PAID';
    }
    
    await invoice.save();

    res.status(201).json({
      payment,
      invoice: {
        amountPaid: invoice.amountPaid,
        balanceDue: invoice.balanceDue,
        status: invoice.status
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/invoices/:id/archive - Archive invoice
router.post('/:id/archive', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.isArchived = true;
    await invoice.save();

    res.json({ message: 'Invoice archived successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/invoices/:id/restore - Restore archived invoice
router.post('/:id/restore', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.isArchived = false;
    await invoice.save();

    res.json({ message: 'Invoice restored successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/invoices - Get all invoices (bonus endpoint for listing)
router.get('/', async (req, res) => {
  try {
    const { archived } = req.query;
    const filter = archived === 'true' ? { isArchived: true } : { isArchived: false };
    
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/invoices - Create new invoice (bonus endpoint for creating)
router.post('/', async (req, res) => {
  try {
    const { invoiceNumber, customerName, issueDate, dueDate, lineItems } = req.body;

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
      total: 0,
      amountPaid: 0,
      balanceDue: 0
    });

    await invoice.save();

    // Create line items if provided
    if (lineItems && lineItems.length > 0) {
      let total = 0;
      
      for (const item of lineItems) {
        const lineItem = new InvoiceLine({
          invoiceId: invoice._id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.quantity * item.unitPrice
        });
        await lineItem.save();
        total += lineItem.lineTotal;
      }

      // Update invoice total
      invoice.total = total;
      invoice.balanceDue = total;
      await invoice.save();
    }

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
