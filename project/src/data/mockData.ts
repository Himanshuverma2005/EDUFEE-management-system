import { Student, FeeStructure, Payment, DashboardStats } from '../types';

// Empty data arrays - no demo data
export const mockStudents: Student[] = [];

export const mockFeeStructures: FeeStructure[] = [];

export const mockPayments: Payment[] = [];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 0,
  totalCollected: 0,
  pendingAmount: 0,
  overduePayments: 0,
  recentPayments: [],
  monthlyCollection: []
};

// Class-wise fee summary for better organization
export const getClassWiseFeeData = () => {
  const classData: { [key: string]: { totalStudents: number; totalFees: number; collected: number; pending: number } } = {};
  
  mockFeeStructures.forEach(structure => {
    const studentsInClass = mockStudents.filter(s => s.class === structure.class).length;
    const paymentsInClass = mockPayments.filter(p => {
      const student = mockStudents.find(s => s.id === p.studentId);
      return student?.class === structure.class;
    });
    
    const totalCollected = paymentsInClass.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalExpected = studentsInClass * structure.totalAmount;
    
    classData[structure.class] = {
      totalStudents: studentsInClass,
      totalFees: totalExpected,
      collected: totalCollected,
      pending: totalExpected - totalCollected
    };
  });
  
  return classData;
};