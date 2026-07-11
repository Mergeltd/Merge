import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginDto } from '@merge/shared-types';
import { authService } from '../../services/auth.service';
import { cn } from '../../lib/utils';
import { Mail, Lock, Building2 } from 'lucide-react';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      await authService.login(data);
      alert('Login successful! Welcome to MERGE.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">Secure access to your property ecosystem</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                {...register('email')}
                className={cn(
                  "w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all",
                  errors.email ? "border-red-500" : "border-slate-200 focus:border-indigo-500"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                {...register('password')}
                className={cn(
                  "w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all",
                  errors.password ? "border-red-500" : "border-slate-200 focus:border-indigo-500"
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 font-semibold hover:underline">Forgot password?</a>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Don't have an account? <a href="/register" className="text-indigo-600 font-semibold hover:underline">Register Now</a>
        </div>
      </motion.div>
    </div>
  );
}
