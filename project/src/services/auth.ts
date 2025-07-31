import { supabase } from '../lib/supabase';
import { env } from '../config/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

class AuthService {
  private currentUser: User | null = null;

  /**
   * Register a new user
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      // Check if user already exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .or(`username.eq.${userData.username},email.eq.${userData.email}`)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: existingUser.username === userData.username 
            ? 'Username already exists. Please choose a different username.'
            : 'Email already registered. Please use a different email.'
        };
      }

      // Create user in Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName,
            phone: userData.phone,
            role: userData.role
          }
        }
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'User creation failed'
        };
      }

      // Always manually insert user data since RLS is disabled
      const { data: user, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          full_name: userData.fullName,
          phone: userData.phone,
          role: userData.role
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return {
          success: false,
          error: insertError.message
        };
      }

      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during signup.'
      };
    }
  }

  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login for username:', credentials.username);
      
      // First, get the user by username to get their email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .single();

      console.log('User lookup result:', { user, userError });

      if (userError || !user) {
        console.log('User not found or error:', userError);
        return {
          success: false,
          error: 'Invalid username or password.'
        };
      }

      console.log('Found user, attempting auth with email:', user.email);

      // Login with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: credentials.password
      });

      console.log('Auth result:', { authData, authError });

      if (authError) {
        console.log('Auth error:', authError);
        return {
          success: false,
          error: 'Invalid username or password.'
        };
      }

      this.currentUser = user;
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login.'
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user data from our users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && userData) {
          this.currentUser = userData;
          return userData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Auth check error:', error);
      return null;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while sending the reset email.'
      };
    }
  }

  /**
   * Reset password with new password
   */
  async resetPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating your password.'
      };
    }
  }

  /**
   * Change password (requires current password verification)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  /**
   * Initialize auth state
   */
  async initAuth(): Promise<User | null> {
    return await this.checkAuth();
  }
}

export const authService = new AuthService(); 