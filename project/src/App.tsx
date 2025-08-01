import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import EmailVerificationPage from './components/Auth/EmailVerificationPage';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ChangePasswordForm from './components/Auth/ChangePasswordForm';
import PaymentForm from './components/Payments/PaymentForm';
import FeeStructureForm from './components/FeeStructure/FeeStructureForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import StudentList from './components/Students/StudentList';
import StudentForm from './components/Students/StudentForm';
import PaymentList from './components/Payments/PaymentList';
import FeeStructureList from './components/FeeStructure/FeeStructureList';
import ReportsView from './components/Reports/ReportsView';
import ToastContainer from './components/ToastContainer';

import { mockStudents, mockPayments, mockFeeStructures, mockDashboardStats } from './data/mockData';
import { Student, Payment, FeeStructure } from './types';
import { logEnvironmentInfo } from './utils/env-helpers';
import { authService, User } from './services/auth';
import { useToast } from './hooks/useToast';

function App() {
  // Log environment information on app start
  useEffect(() => {
    logEnvironmentInfo();
  }, []);

  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments.map(p => ({
    ...p,
    studentClass: students.find(s => s.id === p.studentId)?.class
  })));
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(mockFeeStructures);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments.map(p => ({
    ...p,
    studentClass: students.find(s => s.id === p.studentId)?.class
  })));
  
  // Modal states
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showFeeStructureForm, setShowFeeStructureForm] = useState(false);
  const [editingFeeStructure, setEditingFeeStructure] = useState<FeeStructure | undefined>();

  // State for email verification
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Initialize authentication on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.initAuth();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const response = await authService.login(credentials);
    
    if (response.success && response.user) {
      showSuccess('Login Successful!', `Welcome back, ${response.user.full_name}!`);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setShowSignup(false);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const handleSignup = async (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: string;
  }) => {
    try {
      const response = await authService.signup(userData);
      
      if (response.success) {
        setShowSignup(false);
        setShowEmailVerification(true);
        setVerificationEmail(userData.email);
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Even if there's an error, we can still show the verification page
      // since Supabase might have created the user but failed to return the response
      setShowSignup(false);
      setShowEmailVerification(true);
      setVerificationEmail(userData.email);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    showInfo('Logged Out', 'You have been successfully logged out.');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleRequestPasswordReset = async (email: string) => {
    const response = await authService.requestPasswordReset(email);
    
    if (response.success) {
      showSuccess(
        'Reset Link Sent!',
        'Please check your email and click the reset link to change your password.',
        8000
      );
    } else {
      throw new Error(response.error || 'Failed to send reset email');
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!verificationEmail) return;
    
    setIsResendingEmail(true);
    try {
      const response = await authService.resendEmailVerification(verificationEmail);
      
      if (response.success) {
        showSuccess(
          'Verification Email Sent!',
          'A new verification email has been sent to your inbox.',
          5000
        );
      } else {
        throw new Error(response.error || 'Failed to resend verification email');
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleBackToLogin = () => {
    setShowEmailVerification(false);
    setVerificationEmail('');
    setShowSignup(false);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const response = await authService.changePassword(currentPassword, newPassword);
    
    if (response.success) {
      showSuccess(
        'Password Changed!',
        'Your password has been updated successfully.',
        5000
      );
    } else {
      throw new Error(response.error || 'Failed to change password');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredStudents(students);
      setFilteredPayments(payments);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Filter students
    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.rollNumber.toLowerCase().includes(lowerQuery) ||
      student.class.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      student.fatherName.toLowerCase().includes(lowerQuery)
    );

    // Filter payments
    const filteredPayments = payments.filter(payment =>
      payment.studentName.toLowerCase().includes(lowerQuery) ||
      payment.rollNumber.toLowerCase().includes(lowerQuery) ||
      payment.receiptNumber.toLowerCase().includes(lowerQuery) ||
      payment.status.toLowerCase().includes(lowerQuery) ||
      payment.paymentMethod.toLowerCase().includes(lowerQuery)
    );

    setFilteredStudents(filteredStudents);
    setFilteredPayments(filteredPayments);
  };

  if (!isAuthenticated) {
    if (showEmailVerification && verificationEmail) {
      return (
        <EmailVerificationPage 
          email={verificationEmail}
          onBackToLogin={handleBackToLogin}
          onResendEmail={handleResendVerificationEmail}
          isResending={isResendingEmail}
        />
      );
    }
    
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm
          onRequestReset={handleRequestPasswordReset}
          onSwitchToLogin={() => setShowForgotPassword(false)}
        />
      );
    }
    
    if (showSignup) {
      return (
        <SignupForm 
          onSignup={handleSignup}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    
    return (
      <LoginForm 
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
        onSwitchToForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setShowStudentForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleViewStudent = (student: Student) => {
    // Handle view student logic
    console.log('View student:', student);
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(s => 
        s.id === editingStudent.id ? { ...s, ...studentData } : s
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } else {
      // Add new student
      const newStudent: Student = {
        ...studentData as Student,
        id: Date.now().toString()
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    }
    setShowStudentForm(false);
    setEditingStudent(undefined);
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      const updatedStudents = students.filter(s => s.id !== student.id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      
      // Also remove any payments associated with this student
      const updatedPayments = payments.filter(p => p.studentId !== student.id);
      setPayments(updatedPayments);
      setFilteredPayments(updatedPayments);
    }
  };

  const handleAddPayment = () => {
    setShowPaymentForm(true);
  };

  const handleSavePayment = (paymentData: any) => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      ...paymentData,
      studentClass: students.find(s => s.id === paymentData.studentId)?.class
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    setFilteredPayments(updatedPayments);
    setShowPaymentForm(false);
  };

  const handleViewReceipt = (payment: Payment) => {
    // Handle view receipt logic
    console.log('View receipt:', payment);
  };

  const handleAddStructure = () => {
    setEditingFeeStructure(undefined);
    setShowFeeStructureForm(true);
  };

  const handleEditStructure = (structure: FeeStructure) => {
    setEditingFeeStructure(structure);
    setShowFeeStructureForm(true);
  };

  const handleSaveFeeStructure = (feeStructureData: Partial<FeeStructure>) => {
    if (editingFeeStructure) {
      // Update existing fee structure
      setFeeStructures(prev => prev.map(fs => 
        fs.id === editingFeeStructure.id ? { ...fs, ...feeStructureData } : fs
      ));
    } else {
      // Add new fee structure
      const newFeeStructure: FeeStructure = {
        ...feeStructureData as FeeStructure,
        id: Date.now().toString()
      };
      setFeeStructures(prev => [...prev, newFeeStructure]);
    }
    setShowFeeStructureForm(false);
    setEditingFeeStructure(undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            students={students}
            payments={payments}
            feeStructures={feeStructures}
            onViewAllPayments={() => setActiveTab('payments')}
            onAddStudent={handleAddStudent}
            onAddPayment={handleAddPayment}
            onViewReports={() => setActiveTab('reports')}
          />
        );
      
      case 'students':
        return (
          <StudentList
            students={filteredStudents}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onViewStudent={handleViewStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      
      case 'payments':
        return (
          <PaymentList
            payments={filteredPayments}
            onAddPayment={handleAddPayment}
            onViewReceipt={handleViewReceipt}
          />
        );
      
      case 'fees':
        return (
          <FeeStructureList
            feeStructures={feeStructures}
            onAddStructure={handleAddStructure}
            onEditStructure={handleEditStructure}
          />
        );
      
      case 'reports':
        return <ReportsView students={students} payments={payments} feeStructures={feeStructures} />;
      
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
                {currentUser && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {currentUser.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{currentUser.full_name}</p>
                        <p className="text-sm text-gray-600">{currentUser.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
                <div className="space-y-3">
                                  <button 
                  onClick={() => setShowChangePassword(true)}
                  className="btn-secondary w-full justify-center"
                >
                  Change Password
                </button>
                  <button className="btn-secondary w-full justify-center">
                    Update Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header currentUser={currentUser} onSearch={handleSearch} />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Student Form Modal */}
      {showStudentForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => {
            setShowStudentForm(false);
            setEditingStudent(undefined);
          }}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm
          students={students}
          feeStructures={feeStructures}
          onSave={handleSavePayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}

      {/* Fee Structure Form Modal */}
      {showFeeStructureForm && (
        <FeeStructureForm
          feeStructure={editingFeeStructure}
          onSave={handleSaveFeeStructure}
          onCancel={() => {
            setShowFeeStructureForm(false);
            setEditingFeeStructure(undefined);
          }}
        />
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordForm
          onClose={() => setShowChangePassword(false)}
          onPasswordChange={handleChangePassword}
        />
      )}
    </div>
  );
}

export default App;