import React, { useState } from 'react';
import { Student } from '../../types';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
}

export default function StudentList({ students, onAddStudent, onEditStudent, onViewStudent, onDeleteStudent }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        <button onClick={onAddStudent} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Roll Number</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Father's Name</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-gray-900">
                    {student.rollNumber}
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {student.class} - {student.section}
                    </span>
                  </td>
                  <td className="table-cell text-gray-600">
                    {student.phone}
                  </td>
                  <td className="table-cell text-gray-600">
                    {student.fatherName}
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewStudent(student)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(student)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}