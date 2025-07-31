import React from 'react';
import { Student, Payment, FeeStructure } from '../../types';
import { BookOpen, Users, DollarSign, AlertCircle } from 'lucide-react';

interface ClassWiseReportProps {
  students: Student[];
  payments: Payment[];
  feeStructures: FeeStructure[];
}

export default function ClassWiseReport({ students, payments, feeStructures }: ClassWiseReportProps) {
  const calculateClassData = () => {
    const classData: { [key: string]: {
      totalStudents: number;
      totalFees: number;
      collected: number;
      pending: number;
    } } = {};

    // Initialize stats for all classes
    feeStructures.forEach(structure => {
      classData[structure.class] = {
        totalStudents: 0,
        totalFees: 0,
        collected: 0,
        pending: 0
      };
    });

    // Calculate student counts and expected fees
    students.forEach(student => {
      const feeStructure = feeStructures.find(fs => fs.class === student.class);
      if (feeStructure && classData[student.class]) {
        classData[student.class].totalStudents += 1;
        classData[student.class].totalFees += feeStructure.totalAmount;
      }
    });

    // Calculate collected amounts
    payments.forEach(payment => {
      const student = students.find(s => s.id === payment.studentId);
      if (student && classData[student.class]) {
        classData[student.class].collected += payment.paidAmount;
      }
    });

    // Calculate pending amounts
    Object.keys(classData).forEach(className => {
      const stats = classData[className];
      stats.pending = stats.totalFees - stats.collected;
    });

    return classData;
  };

  const classData = calculateClassData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Class-wise Fee Report</h3>
          <p className="text-sm text-gray-500">Fee collection status by class</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(classData).map(([className, data]) => {
          const collectionRate = (data.collected / data.totalFees) * 100;
          
          return (
            <div key={className} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-lg">{className}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Class {className}</h4>
                    <p className="text-sm text-gray-500">{data.totalStudents} students</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-600">Collected</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    ₹{data.collected.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    ₹{data.pending.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Collection Rate</span>
                    <span className="text-sm font-bold text-gray-900">
                      {collectionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        collectionRate >= 80 ? 'bg-emerald-500' :
                        collectionRate >= 60 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(collectionRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    Total Expected: ₹{data.totalFees.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Table */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Students</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Expected</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Collected</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Pending</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(classData).map(([className, data]) => {
                const collectionRate = (data.collected / data.totalFees) * 100;
                
                return (
                  <tr key={className} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">
                      Class {className}
                    </td>
                    <td className="table-cell text-gray-600">
                      {data.totalStudents}
                    </td>
                    <td className="table-cell font-medium text-gray-900">
                      ₹{data.totalFees.toLocaleString()}
                    </td>
                    <td className="table-cell font-medium text-emerald-600">
                      ₹{data.collected.toLocaleString()}
                    </td>
                    <td className="table-cell font-medium text-orange-600">
                      ₹{data.pending.toLocaleString()}
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collectionRate >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        collectionRate >= 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {collectionRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}