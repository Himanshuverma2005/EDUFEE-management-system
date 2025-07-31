import React, { useState } from 'react';
import { Payment } from '../../types';
import { Search, Plus, Eye, Receipt, Filter } from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
  onAddPayment: () => void;
  onViewReceipt: (payment: Payment) => void;
}

export default function PaymentList({ payments, onAddPayment, onViewReceipt }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMethod = !methodFilter || payment.paymentMethod === methodFilter;
    const matchesClass = !classFilter || payment.studentClass === classFilter;
    return matchesSearch && matchesStatus && matchesMethod && matchesClass;
  });

  // Get unique classes from payments
  const classes = Array.from(new Set(payments.map(p => p.studentClass).filter(Boolean))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
        <button onClick={onAddPayment} className="btn-primary">
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Receipt #</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Method</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Date</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-sm text-gray-500">{payment.rollNumber}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {payment.studentClass}
                    </span>
                  </td>
                  <td className="table-cell font-medium text-blue-600">
                    {payment.receiptNumber}
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">
                        ${payment.paidAmount.toLocaleString()}
                      </p>
                      {payment.paidAmount < payment.totalAmount && (
                        <p className="text-sm text-gray-500">
                          of ${payment.totalAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="capitalize text-gray-600">
                      {payment.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`status-${payment.status}`}>
                      {payment.status === 'paid' ? 'Paid' : 
                       payment.status === 'partial' ? 'Partial' : 'Pending'}
                    </span>
                  </td>
                  <td className="table-cell text-gray-600">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewReceipt(payment)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}