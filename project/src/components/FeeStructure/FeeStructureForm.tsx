import React, { useState } from 'react';
import { FeeStructure, FeeItem } from '../../types';
import { X, Plus, Trash2, Calculator } from 'lucide-react';

interface FeeStructureFormProps {
  feeStructure?: FeeStructure;
  onSave: (feeStructure: Partial<FeeStructure>) => void;
  onCancel: () => void;
}

export default function FeeStructureForm({ feeStructure, onSave, onCancel }: FeeStructureFormProps) {
  const [formData, setFormData] = useState({
    class: feeStructure?.class || '',
    academicYear: feeStructure?.academicYear || '2024-25',
    fees: feeStructure?.fees || [
      {
        id: Date.now().toString(),
        name: 'Tuition Fee',
        amount: 0,
        dueDate: '',
        mandatory: true,
        description: ''
      }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.fees.reduce((sum, fee) => sum + fee.amount, 0);
    onSave({
      ...formData,
      totalAmount
    });
  };

  const handleFeeChange = (index: number, field: keyof FeeItem, value: any) => {
    const updatedFees = [...formData.fees];
    updatedFees[index] = { ...updatedFees[index], [field]: value };
    setFormData(prev => ({ ...prev, fees: updatedFees }));
  };

  const addFeeItem = () => {
    const newFee: FeeItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      dueDate: '',
      mandatory: false,
      description: ''
    };
    setFormData(prev => ({ ...prev, fees: [...prev.fees, newFee] }));
  };

  const removeFeeItem = (index: number) => {
    if (formData.fees.length > 1) {
      const updatedFees = formData.fees.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, fees: updatedFees }));
    }
  };

  const calculateTotal = () => {
    return formData.fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feeStructure ? 'Edit Fee Structure' : 'Create Fee Structure'}
              </h3>
              <p className="text-sm text-gray-500">Configure fees for a class</p>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                <option value="1st">1st Class</option>
                <option value="2nd">2nd Class</option>
                <option value="3rd">3rd Class</option>
                <option value="4th">4th Class</option>
                <option value="5th">5th Class</option>
                <option value="6th">6th Class</option>
                <option value="7th">7th Class</option>
                <option value="8th">8th Class</option>
                <option value="9th">9th Class</option>
                <option value="10th">10th Class</option>
                <option value="11th">11th Class</option>
                <option value="12th">12th Class</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2024-25"
              />
            </div>
          </div>

          {/* Fee Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Fee Components</h4>
              <button
                type="button"
                onClick={addFeeItem}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Fee Item
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.fees.map((fee, index) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Fee Item #{index + 1}</h5>
                    {formData.fees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeeItem(index)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fee Name *
                      </label>
                      <input
                        type="text"
                        value={fee.name}
                        onChange={(e) => handleFeeChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Tuition Fee"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={fee.amount}
                        onChange={(e) => handleFeeChange(index, 'amount', Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={fee.dueDate}
                        onChange={(e) => handleFeeChange(index, 'dueDate', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fee.mandatory}
                        onChange={(e) => handleFeeChange(index, 'mandatory', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Mandatory Fee (Required for all students)
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={fee.description || ''}
                        onChange={(e) => handleFeeChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional details about this fee..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Total Fee Structure</h4>
                <p className="text-sm text-blue-700">
                  {formData.fees.filter(f => f.mandatory).length} mandatory + {formData.fees.filter(f => !f.mandatory).length} optional fees
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700">Total Amount</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${calculateTotal().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button type="submit" className="btn-primary">
              <Calculator className="w-4 h-4" />
              {feeStructure ? 'Update Fee Structure' : 'Create Fee Structure'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}