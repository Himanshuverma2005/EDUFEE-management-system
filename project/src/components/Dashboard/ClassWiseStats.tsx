import React from 'react';
import { Student, Payment, FeeStructure } from '../../types';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';

interface ClassWiseStatsProps {
  students: Student[];
  payments: Payment[];
  feeStructures: FeeStructure[];
}

export default function ClassWiseStats({ students, payments, feeStructures }: ClassWiseStatsProps) {
  const calculateClassStats = () => {
    const classStats: { [key: string]: {
      totalStudents: number;
      totalFees: number;
      collected: number;
      pending: number;
      collectionRate: number;
    } } = {};

    // Initialize stats for all classes
    feeStructures.forEach(structure => {
      classStats[structure.class] = {
        totalStudents: 0,
        totalFees: 0,
        collected: 0,
        pending: 0,
        collectionRate: 0
      };
    });

    // Calculate student counts and expected fees
    students.forEach(student => {
      const feeStructure = feeStructures.find(fs => fs.class === student.class);
      if (feeStructure && classStats[student.class]) {
        classStats[student.class].totalStudents += 1;
        classStats[student.class].totalFees += feeStructure.totalAmount;
      }
    });

    // Calculate collected amounts
    payments.forEach(payment => {
      const student = students.find(s => s.id === payment.studentId);
      if (student && classStats[student.class]) {
        classStats[student.class].collected += payment.paidAmount;
      }
    });

    // Calculate pending amounts and collection rates
    Object.keys(classStats).forEach(className => {
      const stats = classStats[className];
      stats.pending = stats.totalFees - stats.collected;
      stats.collectionRate = stats.totalFees > 0 ? (stats.collected / stats.totalFees) * 100 : 0;
    });

    return classStats;
  };

  const classStats = calculateClassStats();
  const sortedClasses = Object.keys(classStats).sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    return aNum - bNum;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Class-wise Collection Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Class-wise Collection</h3>
              <p className="text-sm text-gray-500">Fee collection by class</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedClasses.map(className => {
            const stats = classStats[className];
            const progressPercentage = Math.min((stats.collected / stats.totalFees) * 100, 100);
            
            return (
              <div key={className} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{className} Class</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {stats.collectionRate.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Students</p>
                    <p className="font-medium text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Collected</p>
                    <p className="font-medium text-emerald-600">₹{stats.collected.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pending</p>
                    <p className="font-medium text-orange-600">₹{stats.pending.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Collection Summary</h3>
              <p className="text-sm text-gray-500">Overall performance metrics</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Total Students by Class */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Students by Class</h4>
            <div className="space-y-2">
              {sortedClasses.map(className => {
                const stats = classStats[className];
                return (
                  <div key={className} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{className} Class</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(stats.totalStudents / Math.max(...Object.values(classStats).map(s => s.totalStudents))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{stats.totalStudents}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collection Performance */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Collection Performance</h4>
            <div className="space-y-3">
              {sortedClasses.map(className => {
                const stats = classStats[className];
                return (
                  <div key={className} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{className} Class</p>
                      <p className="text-sm text-gray-500">
                        ₹{stats.collected.toLocaleString()} / ₹{stats.totalFees.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        stats.collectionRate >= 80 ? 'text-emerald-600' : 
                        stats.collectionRate >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {stats.collectionRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.collectionRate >= 80 ? 'Excellent' : 
                         stats.collectionRate >= 60 ? 'Good' : 'Needs Attention'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 