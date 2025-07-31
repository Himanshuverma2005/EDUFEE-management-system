import React from 'react';
import { Payment } from '../../types';
import { Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface RecentPaymentsProps {
  payments: Payment[];
  onViewAll?: () => void;
}

export default function RecentPayments({ payments, onViewAll }: RecentPaymentsProps) {
  // Get recent payments (last 5)
  const recentPayments = payments
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-600 bg-emerald-50';
      case 'partial':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <p className="text-sm text-gray-500">Latest fee payments</p>
          </div>
        </div>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell">
                  <div>
                    <p className="font-medium text-gray-900">{payment.studentName}</p>
                    <p className="text-sm text-gray-500">{payment.rollNumber}</p>
                  </div>
                </td>
                <td className="table-cell font-medium text-gray-900">
                  ₹{payment.paidAmount.toLocaleString()}
                </td>
                <td className="table-cell">
                  <span className="capitalize text-gray-600">
                    {payment.paymentMethod.replace('_', ' ')}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status === 'paid' ? 'Paid' : 
                       payment.status === 'partial' ? 'Partial' : 'Pending'}
                    </span>
                  </div>
                </td>
                <td className="table-cell text-gray-600">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}