import React from 'react';
import { Student, Payment, FeeStructure } from '../../types';
import DashboardStatsComponent from './DashboardStats';
import ClassWiseStats from './ClassWiseStats';
import MonthlyCollectionChart from './MonthlyCollectionChart';
import RecentPayments from './RecentPayments';

interface DashboardProps {
  students: Student[];
  payments: Payment[];
  feeStructures: FeeStructure[];
  onViewAllPayments?: () => void;
  onAddStudent?: () => void;
  onAddPayment?: () => void;
  onViewReports?: () => void;
}

export default function Dashboard({ 
  students, 
  payments, 
  feeStructures, 
  onViewAllPayments,
  onAddStudent,
  onAddPayment,
  onViewReports
}: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to School Fee Management</h1>
            <p className="text-blue-100">
              Manage student fees, track collections, and monitor financial performance
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Today's Date</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <DashboardStatsComponent 
        students={students}
        payments={payments}
        feeStructures={feeStructures}
      />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyCollectionChart payments={payments} />
        <RecentPayments 
          payments={payments} 
          onViewAll={onViewAllPayments}
        />
      </div>

      {/* Class-wise Statistics */}
      <ClassWiseStats 
        students={students}
        payments={payments}
        feeStructures={feeStructures}
      />

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={onAddStudent}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Student</p>
                <p className="text-sm text-gray-500">Register new student</p>
              </div>
            </div>
          </div>

          <div 
            onClick={onAddPayment}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Record Payment</p>
                <p className="text-sm text-gray-500">Process fee payment</p>
              </div>
            </div>
          </div>

          <div 
            onClick={onViewReports}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-500">Generate reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 