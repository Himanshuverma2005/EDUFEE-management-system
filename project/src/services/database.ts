import { supabase } from '../lib/supabase';
import { Student, FeeStructure, Payment, FeeItem } from '../types';

// Auth Services
export const authService = {
  async signUp(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: string;
  }) {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;

    // Then create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          full_name: userData.fullName,
          phone: userData.phone,
          role: userData.role,
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return { user, profile };
    }
    
    return { user: null, profile: null };
  }
};

// Student Services
export const studentService = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(student => ({
      id: student.id,
      rollNumber: student.roll_number,
      name: student.name,
      class: student.class,
      section: student.section,
      fatherName: student.father_name,
      motherName: student.mother_name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      dateOfBirth: student.date_of_birth,
      admissionDate: student.admission_date,
      profileImage: student.profile_image,
    }));
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert({
        roll_number: student.rollNumber,
        name: student.name,
        class: student.class,
        section: student.section,
        father_name: student.fatherName,
        mother_name: student.motherName,
        email: student.email,
        phone: student.phone,
        address: student.address,
        date_of_birth: student.dateOfBirth,
        admission_date: student.admissionDate,
        profile_image: student.profileImage,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      rollNumber: data.roll_number,
      name: data.name,
      class: data.class,
      section: data.section,
      fatherName: data.father_name,
      motherName: data.mother_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.date_of_birth,
      admissionDate: data.admission_date,
      profileImage: data.profile_image,
    };
  },

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({
        roll_number: student.rollNumber,
        name: student.name,
        class: student.class,
        section: student.section,
        father_name: student.fatherName,
        mother_name: student.motherName,
        email: student.email,
        phone: student.phone,
        address: student.address,
        date_of_birth: student.dateOfBirth,
        admission_date: student.admissionDate,
        profile_image: student.profileImage,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      rollNumber: data.roll_number,
      name: data.name,
      class: data.class,
      section: data.section,
      fatherName: data.father_name,
      motherName: data.mother_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.date_of_birth,
      admissionDate: data.admission_date,
      profileImage: data.profile_image,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Fee Structure Services
export const feeStructureService = {
  async getAll(): Promise<FeeStructure[]> {
    const { data: structures, error: structuresError } = await supabase
      .from('fee_structures')
      .select('*')
      .order('created_at', { ascending: false });

    if (structuresError) throw structuresError;

    const { data: items, error: itemsError } = await supabase
      .from('fee_items')
      .select('*');

    if (itemsError) throw itemsError;

    return structures.map(structure => ({
      id: structure.id,
      class: structure.class,
      academicYear: structure.academic_year,
      totalAmount: structure.total_amount,
      fees: items
        .filter(item => item.fee_structure_id === structure.id)
        .map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          dueDate: item.due_date,
          mandatory: item.mandatory,
          description: item.description,
        })),
    }));
  },

  async create(feeStructure: Omit<FeeStructure, 'id'>): Promise<FeeStructure> {
    // Create fee structure
    const { data: structureData, error: structureError } = await supabase
      .from('fee_structures')
      .insert({
        class: feeStructure.class,
        academic_year: feeStructure.academicYear,
        total_amount: feeStructure.totalAmount,
      })
      .select()
      .single();

    if (structureError) throw structureError;

    // Create fee items
    const feeItemsData = feeStructure.fees.map(fee => ({
      fee_structure_id: structureData.id,
      name: fee.name,
      amount: fee.amount,
      due_date: fee.dueDate,
      mandatory: fee.mandatory,
      description: fee.description,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('fee_items')
      .insert(feeItemsData)
      .select();

    if (itemsError) throw itemsError;

    return {
      id: structureData.id,
      class: structureData.class,
      academicYear: structureData.academic_year,
      totalAmount: structureData.total_amount,
      fees: itemsData.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        dueDate: item.due_date,
        mandatory: item.mandatory,
        description: item.description,
      })),
    };
  },

  async update(id: string, feeStructure: Partial<FeeStructure>): Promise<FeeStructure> {
    // Update fee structure
    const { data: structureData, error: structureError } = await supabase
      .from('fee_structures')
      .update({
        class: feeStructure.class,
        academic_year: feeStructure.academicYear,
        total_amount: feeStructure.totalAmount,
      })
      .eq('id', id)
      .select()
      .single();

    if (structureError) throw structureError;

    // Delete existing fee items
    await supabase
      .from('fee_items')
      .delete()
      .eq('fee_structure_id', id);

    // Create new fee items
    if (feeStructure.fees) {
      const feeItemsData = feeStructure.fees.map(fee => ({
        fee_structure_id: id,
        name: fee.name,
        amount: fee.amount,
        due_date: fee.dueDate,
        mandatory: fee.mandatory,
        description: fee.description,
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('fee_items')
        .insert(feeItemsData)
        .select();

      if (itemsError) throw itemsError;

      return {
        id: structureData.id,
        class: structureData.class,
        academicYear: structureData.academic_year,
        totalAmount: structureData.total_amount,
        fees: itemsData.map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          dueDate: item.due_date,
          mandatory: item.mandatory,
          description: item.description,
        })),
      };
    }

    return {
      id: structureData.id,
      class: structureData.class,
      academicYear: structureData.academic_year,
      totalAmount: structureData.total_amount,
      fees: [],
    };
  },

  async delete(id: string): Promise<void> {
    // Delete fee items first (due to foreign key constraint)
    await supabase
      .from('fee_items')
      .delete()
      .eq('fee_structure_id', id);

    // Delete fee structure
    const { error } = await supabase
      .from('fee_structures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Payment Services
export const paymentService = {
  async getAll(): Promise<Payment[]> {
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        *,
        students (
          name,
          roll_number,
          class
        )
      `)
      .order('created_at', { ascending: false });

    if (paymentsError) throw paymentsError;

    const { data: paymentItems, error: itemsError } = await supabase
      .from('payment_items')
      .select('*');

    if (itemsError) throw itemsError;

    return payments.map(payment => ({
      id: payment.id,
      studentId: payment.student_id,
      studentName: payment.students.name,
      rollNumber: payment.students.roll_number,
      studentClass: payment.students.class,
      totalAmount: payment.total_amount,
      paidAmount: payment.paid_amount,
      paymentDate: payment.payment_date,
      paymentMethod: payment.payment_method as any,
      status: payment.status as any,
      receiptNumber: payment.receipt_number,
      academicYear: payment.academic_year,
      remarks: payment.remarks,
      feeItems: paymentItems
        .filter(item => item.payment_id === payment.id)
        .map(item => ({
          feeItemId: item.fee_item_id,
          name: item.name,
          amount: item.amount,
          paidAmount: item.paid_amount,
          status: item.status as any,
        })),
    }));
  },

  async create(payment: Omit<Payment, 'id'>): Promise<Payment> {
    // Create payment
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        student_id: payment.studentId,
        total_amount: payment.totalAmount,
        paid_amount: payment.paidAmount,
        payment_date: payment.paymentDate,
        payment_method: payment.paymentMethod,
        status: payment.status,
        receipt_number: payment.receiptNumber,
        academic_year: payment.academicYear,
        remarks: payment.remarks,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Create payment items
    const paymentItemsData = payment.feeItems.map(item => ({
      payment_id: paymentData.id,
      fee_item_id: item.feeItemId,
      name: item.name,
      amount: item.amount,
      paid_amount: item.paidAmount,
      status: item.status,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('payment_items')
      .insert(paymentItemsData)
      .select();

    if (itemsError) throw itemsError;

    // Get student info
    const { data: studentData } = await supabase
      .from('students')
      .select('name, roll_number, class')
      .eq('id', payment.studentId)
      .single();

    return {
      id: paymentData.id,
      studentId: paymentData.student_id,
      studentName: studentData?.name || '',
      rollNumber: studentData?.roll_number || '',
      studentClass: studentData?.class,
      totalAmount: paymentData.total_amount,
      paidAmount: paymentData.paid_amount,
      paymentDate: paymentData.payment_date,
      paymentMethod: paymentData.payment_method as any,
      status: paymentData.status as any,
      receiptNumber: paymentData.receipt_number,
      academicYear: paymentData.academic_year,
      remarks: paymentData.remarks,
      feeItems: itemsData.map(item => ({
        feeItemId: item.fee_item_id,
        name: item.name,
        amount: item.amount,
        paidAmount: item.paid_amount,
        status: item.status as any,
      })),
    };
  }
};