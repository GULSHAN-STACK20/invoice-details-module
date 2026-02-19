import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './InvoiceDetails.css';
import AddPaymentModal from '../components/AddPaymentModal';
import Toast from '../components/Toast';

function InvoiceDetails() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/invoices/${id}`);
      setInvoiceData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      await axios.post(`/api/invoices/${id}/payments`, paymentData);
      await fetchInvoiceDetails(); // Refresh data
      setShowPaymentModal(false);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add payment');
    }
  };

  const handleArchive = async () => {
    try {
      await axios.post(`/api/invoices/${id}/archive`);
      await fetchInvoiceDetails();
      setToast({ message: 'Invoice archived successfully', type: 'success' });
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to archive invoice', 
        type: 'error' 
      });
    }
  };

  const handleRestore = async () => {
    try {
      await axios.post(`/api/invoices/${id}/restore`);
      await fetchInvoiceDetails();
      setToast({ message: 'Invoice restored successfully', type: 'success' });
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to restore invoice', 
        type: 'error' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="invoice-container">
        <div className="loading">Loading invoice details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="invoice-container">
        <div className="error-message">Invoice not found</div>
      </div>
    );
  }

  const { invoice, lineItems, payments } = invoiceData;

  return (
    <div className="invoice-container">
      {/* Header Section */}
      <div className="invoice-header">
        <div className="invoice-header-left">
          <h1 className="invoice-number">{invoice.invoiceNumber}</h1>
          <p className="customer-name">{invoice.customerName}</p>
        </div>
        <div className="invoice-header-right">
          <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
            {invoice.status}
          </span>
          {invoice.isArchived && (
            <span className="status-badge status-archived">ARCHIVED</span>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="invoice-info">
        <div className="info-item">
          <label>Issue Date</label>
          <span>{formatDate(invoice.issueDate)}</span>
        </div>
        <div className="info-item">
          <label>Due Date</label>
          <span>{formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="section">
        <h2>Line Items</h2>
        <div className="table-wrapper">
          <table className="line-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="totals-section">
        <div className="totals-grid">
          <div className="total-item">
            <label>Total</label>
            <span className="total-value">{formatCurrency(invoice.total)}</span>
          </div>
          <div className="total-item">
            <label>Amount Paid</label>
            <span className="paid-value">{formatCurrency(invoice.amountPaid)}</span>
          </div>
          <div className="total-item balance-due">
            <label>Balance Due</label>
            <span className="balance-value">{formatCurrency(invoice.balanceDue)}</span>
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="section payments-section">
        <div className="section-header">
          <h2>Payments</h2>
          {invoice.balanceDue > 0 && !invoice.isArchived && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowPaymentModal(true)}
            >
              Add Payment
            </button>
          )}
        </div>
        
        {payments.length > 0 ? (
          <div className="payments-list">
            {payments.map((payment) => (
              <div key={payment._id} className="payment-item">
                <div className="payment-date">
                  {formatDate(payment.paymentDate)}
                </div>
                <div className="payment-amount">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-payments">No payments recorded yet</p>
        )}
      </div>

      {/* Actions */}
      <div className="invoice-actions">
        {invoice.isArchived ? (
          <button className="btn btn-secondary" onClick={handleRestore}>
            Restore Invoice
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleArchive}>
            Archive Invoice
          </button>
        )}
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <AddPaymentModal
          balanceDue={invoice.balanceDue}
          onSubmit={handleAddPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default InvoiceDetails;
