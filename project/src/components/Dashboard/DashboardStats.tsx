import React from 'react';
import { DollarSign, Users, AlertTriangle, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Student, Payment, FeeStructure } from '../../types';

interface DashboardStatsProps {
  students: Student[];
  payments: Payment[];
  feeStructures: FeeStructure[];
}

export default function DashboardStatsComponent({ students, payments, feeStructures }: DashboardStatsProps) {
  // Calculate real-time statistics
  const calculateStats = () => {
    const totalStudents = students.length;
    
    // Calculate total collected amount
    const totalCollected = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    
    // Calculate total expected fees
    const totalExpected = students.reduce((sum, student) => {
      const feeStructure = feeStructures.find(fs => fs.class === student.class);
      return sum + (feeStructure?.totalAmount || 0);
    }, 0);
    
    // Calculate pending amount
    const pendingAmount = totalExpected - totalCollected;
    
    // Calculate overdue payments (payments with partial status)
    const overduePayments = payments.filter(payment => payment.status === 'partial').length;
    
    // Calculate this month's collection
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCollection = payments
      .filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.paidAmount, 0);
    
    // Calculate collection rate
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    
    return {
      totalStudents,
      totalCollected,
      pendingAmount,
      overduePayments,
      thisMonthCollection,
      collectionRate
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Collected',
      value: `₹${(stats.totalCollected / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: `₹${(stats.thisMonthCollection / 1000).toFixed(0)}K this month`,
      changeType: 'positive'
    },
    {
      title: 'Pending Amount',
      value: `₹${(stats.pendingAmount / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: `${stats.collectionRate.toFixed(1)}% collected`,
      changeType: stats.collectionRate > 80 ? 'positive' : 'negative'
    },
    {
      title: 'Overdue Payments',
      value: stats.overduePayments.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: `${((stats.overduePayments / stats.totalStudents) * 100).toFixed(1)}% of students`,
      changeType: 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}