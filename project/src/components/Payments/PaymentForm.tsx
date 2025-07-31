import React, { useState } from 'react';
import { Student, FeeStructure, FeeItem } from '../../types';
import { X, Calculator, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  students: Student[];
  feeStructures: FeeStructure[];
  onSave: (paymentData: any) => void;
  onCancel: () => void;
}

export default function PaymentForm({ students, feeStructures, onSave, onCancel }: PaymentFormProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFees, setSelectedFees] = useState<{ [key: string]: { selected: boolean; amount: number } }>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cheque' | 'online' | 'bank_transfer'>('cash');
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const studentFeeStructure = selectedStudent 
    ? feeStructures.find(fs => fs.class === selectedStudent.class)
    : null;

  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Get unique classes for the filter dropdown
  const availableClasses = Array.from(new Set(students.map(s => s.class))).sort();

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student || null);
    setSelectedFees({});
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
  };

  const handleFeeToggle = (feeId: string, feeAmount: number) => {
    setSelectedFees(prev => ({
      ...prev,
      [feeId]: {
        selected: !prev[feeId]?.selected,
        amount: prev[feeId]?.amount || feeAmount
      }
    }));
  };

  const handleAmountChange = (feeId: string, amount: number) => {
    setSelectedFees(prev => ({
      ...prev,
      [feeId]: {
        ...prev[feeId],
        amount: amount
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(selectedFees)
      .filter(fee => fee.selected)
      .reduce((total, fee) => total + fee.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !studentFeeStructure) return;

    const paymentItems = Object.entries(selectedFees)
      .filter(([_, fee]) => fee.selected)
      .map(([feeId, fee]) => {
        const feeItem = studentFeeStructure.fees.find(f => f.id === feeId);
        return {
          feeItemId: feeId,
          name: feeItem?.name || '',
          amount: feeItem?.amount || 0,
          paidAmount: fee.amount,
          status: fee.amount >= (feeItem?.amount || 0) ? 'paid' : 'partial'
        };
      });

    const paymentData = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      rollNumber: selectedStudent.rollNumber,
      feeItems: paymentItems,
      totalAmount: studentFeeStructure.fees.reduce((sum, fee) => sum + fee.amount, 0),
      paidAmount: calculateTotal(),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: calculateTotal() >= studentFeeStructure.totalAmount ? 'paid' : 'partial',
      receiptNumber: `RCP${Date.now()}`,
      academicYear: studentFeeStructure.academicYear,
      remarks
    };

    onSave(paymentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Record Payment</h3>
              <p className="text-sm text-gray-500">Process fee payment for student</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection with Search and Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student *
            </label>
            
            {/* Search and Filter Controls */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, roll number, or father's name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-48">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Classes</option>
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls}>{cls} Class</option>
                  ))}
                </select>
              </div>
              {(searchTerm || selectedClass) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Student Dropdown */}
            <select
              value={selectedStudent?.id || ''}
              onChange={(e) => handleStudentSelect(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {filteredStudents.length === 0 
                  ? 'No students found matching your criteria...' 
                  : 'Choose a student...'}
              </option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.rollNumber} ({student.class}-{student.section})
                </option>
              ))}
            </select>
            
            {/* Search Results Info */}
            {searchTerm || selectedClass ? (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
                {searchTerm && <span> • Search: "{searchTerm}"</span>}
                {selectedClass && <span> • Class: {selectedClass}</span>}
              </div>
            ) : null}
          </div>

          {selectedStudent && studentFeeStructure && (
            <>
              {/* Student Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">{selectedStudent.name}</h4>
                    <p className="text-sm text-blue-700">
                      {selectedStudent.rollNumber} • Class {selectedStudent.class}-{selectedStudent.section}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700">Total Fees</p>
                    <p className="text-lg font-bold text-blue-900">
                      ${studentFeeStructure.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Fee Items to Pay
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {studentFeeStructure.fees.map((fee) => (
                    <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedFees[fee.id]?.selected || false}
                            onChange={() => handleFeeToggle(fee.id, fee.amount)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{fee.name}</p>
                            <p className="text-sm text-gray-500">
                              Due: {new Date(fee.dueDate).toLocaleDateString()}
                              {fee.mandatory && <span className="text-red-500 ml-2">*Required</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${fee.amount}</p>
                        </div>
                      </div>
                      
                      {selectedFees[fee.id]?.selected && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount to Pay
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={fee.amount}
                            value={selectedFees[fee.id]?.amount || fee.amount}
                            onChange={(e) => handleAmountChange(fee.id, Number(e.target.value))}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Payment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <Calculator className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-bold text-gray-900">
                      ${calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button 
                  type="submit" 
                  disabled={calculateTotal() === 0}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  Process Payment (${calculateTotal().toLocaleString()})
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}