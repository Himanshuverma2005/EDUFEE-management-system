import React from 'react';
import { Payment } from '../../types';
import { TrendingUp, Calendar } from 'lucide-react';

interface MonthlyCollectionChartProps {
  payments: Payment[];
}

export default function MonthlyCollectionChart({ payments }: MonthlyCollectionChartProps) {
  const calculateMonthlyData = () => {
    const monthlyData: { [key: string]: number } = {};
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Initialize all months with 0
    monthNames.forEach(month => {
      monthlyData[month] = 0;
    });

    // Calculate monthly collections
    payments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const monthName = monthNames[paymentDate.getMonth()];
      monthlyData[monthName] += payment.paidAmount;
    });

    return monthNames.map(month => ({
      month,
      amount: monthlyData[month]
    }));
  };

  const monthlyData = calculateMonthlyData();
  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

  // Get current month's data
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
  const currentMonthData = monthlyData.find(d => d.month === currentMonth);
  
  // Calculate year-to-date total
  const yearToDateTotal = monthlyData.reduce((sum, data) => sum + data.amount, 0);
  
  // Calculate average monthly collection
  const averageMonthly = monthlyData.reduce((sum, data) => sum + data.amount, 0) / 12;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Collection Trend</h3>
            <p className="text-sm text-gray-500">Fee collection over the year</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">This Month</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            ₹{currentMonthData?.amount.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Year to Date</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            ₹{yearToDateTotal.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Monthly Avg</span>
          </div>
          <p className="text-xl font-bold text-orange-900">
            ₹{averageMonthly.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Monthly Breakdown</h4>
        
        <div className="space-y-3">
          {monthlyData.map((data, index) => {
            const percentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
            const isCurrentMonth = data.month === currentMonth;
            
            return (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {data.month}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isCurrentMonth ? 'bg-purple-600' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
                      ₹{data.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {isCurrentMonth && (
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Performance Indicators</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Best Month</p>
            <p className="font-semibold text-gray-900">
              {monthlyData.reduce((max, data) => data.amount > max.amount ? data : max).month}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Growth Rate</p>
            <p className="font-semibold text-emerald-600">
              {((yearToDateTotal / (averageMonthly * 12)) * 100 - 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 