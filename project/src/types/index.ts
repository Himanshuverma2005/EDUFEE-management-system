export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  class: string;
  section: string;
  fatherName: string;
  motherName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  profileImage?: string;
}

export interface FeeStructure {
  id: string;
  class: string;
  academicYear: string;
  fees: FeeItem[];
  totalAmount: number;
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  mandatory: boolean;
  description?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  studentClass?: string;
  feeItems: PaymentItem[];
  totalAmount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  status: 'paid' | 'partial' | 'pending';
  receiptNumber: string;
  academicYear: string;
  remarks?: string;
}

export interface PaymentItem {
  feeItemId: string;
  name: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
}

export interface DashboardStats {
  totalStudents: number;
  totalCollected: number;
  pendingAmount: number;
  overduePayments: number;
  recentPayments: Payment[];
  monthlyCollection: { month: string; amount: number }[];
}