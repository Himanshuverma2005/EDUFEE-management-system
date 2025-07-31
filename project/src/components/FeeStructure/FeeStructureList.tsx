import React, { useState } from 'react';
import { FeeStructure } from '../../types';
import { Plus, Edit, Eye, BookOpen } from 'lucide-react';

interface FeeStructureListProps {
  feeStructures: FeeStructure[];
  onAddStructure: () => void;
  onEditStructure: (structure: FeeStructure) => void;
}

export default function FeeStructureList({ feeStructures, onAddStructure, onEditStructure }: FeeStructureListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fee Structure</h2>
        <button onClick={onAddStructure} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Fee Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeStructures.map((structure) => (
          <div key={structure.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Class {structure.class}</h3>
                  <p className="text-sm text-gray-500">{structure.academicYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditStructure(structure)}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Fees</span>
                <span className="text-lg font-bold text-blue-600">
                  ${structure.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Fee Components:</p>
                {structure.fees.slice(0, 3).map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{fee.name}</span>
                    <span className="font-medium text-gray-900">${fee.amount}</span>
                  </div>
                ))}
                {structure.fees.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{structure.fees.length - 3} more components
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mandatory Fees</span>
                  <span className="font-medium text-gray-900">
                    {structure.fees.filter(f => f.mandatory).length} of {structure.fees.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feeStructures.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No fee structures found.</p>
          <button onClick={onAddStructure} className="btn-primary">
            <Plus className="w-4 h-4" />
            Create First Fee Structure
          </button>
        </div>
      )}
    </div>
  );
}