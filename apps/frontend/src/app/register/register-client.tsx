'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserSchema, RegisterUserDto } from '@merge/types';
import { authService } from '../../services/auth.service';
import { cn } from '../../lib/utils';
import { User, Mail, Lock, Phone, ArrowRight, Users, Wrench, Building2, Home } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

const roles = [
  { value: 'RESIDENT', label: 'Resident', icon: Users },
  { value: 'TECHNICIAN', label: 'Technician', icon: Wrench },
  { value: 'PROPERTY_MANAGER', label: 'Property Manager', icon: Building2 },
  { value: 'LANDLORD', label: 'Landlord', icon: Home },
];

export default function RegisterClient() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserDto>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const onSubmit = async (data: RegisterUserDto) => {
    setSubmitError(null);
    try {
      await authService.register(data);
      setSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between bg-indigo-600 p-12 overflow-hidden">
        <div aria-hidden className="absolute -top-32 -right-16 w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl" />
        <div aria-hidden className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl" />

        <Logo dark className="relative" />

        <div className="relative">
          <h2 className="text-3xl font-bold text-white leading-tight">
            One account, built for whoever you are
          </h2>
          <p className="mt-4 text-indigo-100 max-w-sm">
            Whether you live in a building, manage one, own one, or fix one — MERGE has an
            experience designed for you.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {roles.map(({ value, label, icon: Icon }) => (
              <div
                key={value}
                className="flex items-center gap-2 text-sm text-indigo-50 bg-white/10 rounded-lg px-3 py-2.5"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-indigo-200">&copy; {new Date().getFullYear()} MERGE</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="bg-indigo-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <h1 className="mt-5 text-xl font-bold text-slate-900">Registration successful!</h1>
              <p className="mt-2 text-sm text-slate-500">
                Please wait for admin verification, then log in to your new account.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
              <p className="text-slate-500 text-sm mt-2">Join the smart property ecosystem.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        {...register('firstName')}
                        className={cn(
                          'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                          errors.firstName ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        {...register('lastName')}
                        className={cn(
                          'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                          errors.lastName ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      {...register('email')}
                      className={cn(
                        'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                        errors.email ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      {...register('phoneNumber')}
                      className={cn(
                        'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                        errors.phoneNumber ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
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
                        'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                        errors.password ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Register As</label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="RESIDENT">Resident</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                    <option value="LANDLORD">Landlord</option>
                  </select>
                </div>

                {submitError && <p className="text-xs text-red-500">{submitError}</p>}

                <button
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Creating Account...' : 'Register Now'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="text-center mt-6 text-xs text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                  Log In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
