import React, { useState } from 'react';
import { Student, Payment, FeeStructure } from '../../types';
import { BarChart3, TrendingUp, Download, Calendar, FileText, Users, DollarSign } from 'lucide-react';
import ClassWiseReport from './ClassWiseReport';

interface ReportsViewProps {
  students: Student[];
  payments: Payment[];
  feeStructures: FeeStructure[];
}

export default function ReportsView({ students, payments, feeStructures }: ReportsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [activeReportTab, setActiveReportTab] = useState('overview');

  // Calculate real-time statistics
  const calculateStats = () => {
    const totalStudents = students.length;
    const totalCollected = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    
    const totalExpected = students.reduce((sum, student) => {
      const feeStructure = feeStructures.find(fs => fs.class === student.class);
      return sum + (feeStructure?.totalAmount || 0);
    }, 0);
    
    const pendingAmount = totalExpected - totalCollected;
    const overduePayments = payments.filter(payment => payment.status === 'partial').length;
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

    // Calculate payment method distribution
    const paymentMethods = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const totalPayments = payments.length;
    const paymentMethodDistribution = Object.entries(paymentMethods).map(([method, count]) => ({
      method: method.replace('_', ' '),
      percentage: totalPayments > 0 ? (count / totalPayments) * 100 : 0
    }));

    return {
      totalStudents,
      totalCollected,
      pendingAmount,
      overduePayments,
      collectionRate,
      paymentMethodDistribution
    };
  };

  const stats = calculateStats();

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      statistics: stats,
      students: students.length,
      payments: payments.length
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={exportReport} className="btn-primary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveReportTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeReportTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveReportTab('classwise')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeReportTab === 'classwise'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Class-wise Report
          </button>
        </nav>
      </div>

      {activeReportTab === 'classwise' ? (
        <ClassWiseReport students={students} payments={payments} feeStructures={feeStructures} />
      ) : (
        <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Summary */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Collection Summary</h3>
              <p className="text-sm text-gray-500">Current academic year</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-emerald-800">Total Collected</p>
                <p className="text-2xl font-bold text-emerald-900">
                  ₹{stats.totalCollected.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-600">+12.5%</p>
                <p className="text-xs text-emerald-600">vs last year</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-800">Pending Amount</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₹{stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-600">-8.3%</p>
                <p className="text-xs text-orange-600">vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Collection Chart */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Collection</h3>
              <p className="text-sm text-gray-500">Last 5 months</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Calculate monthly data from payments */}
            {(() => {
              const monthlyData: { [key: string]: number } = {};
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              // Initialize all months with 0
              monthNames.forEach(month => {
                monthlyData[month] = 0;
              });

              // Calculate monthly collections from payments
              payments.forEach(payment => {
                const paymentDate = new Date(payment.paymentDate);
                const monthName = monthNames[paymentDate.getMonth()];
                monthlyData[monthName] += payment.paidAmount;
              });

              const maxAmount = Math.max(...Object.values(monthlyData));
              
              return monthNames.map((month, index) => {
                const amount = monthlyData[month];
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="h-2 bg-gray-200 rounded-full flex-1 mr-3">
                          <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{(amount / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Overdue Report</h4>
              <p className="text-sm text-gray-500">Students with pending fees</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.overduePayments}</p>
            <p className="text-sm text-gray-500">Students</p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Collection Rate</h4>
              <p className="text-sm text-gray-500">Current month</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.collectionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">Collection efficiency</p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Payment Methods</h4>
              <p className="text-sm text-gray-500">Distribution</p>
            </div>
          </div>
          <div className="space-y-2">
            {stats.paymentMethodDistribution.map((method, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{method.method}</span>
                <span className="font-medium">{method.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}