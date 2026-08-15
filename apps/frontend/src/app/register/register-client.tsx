'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserSchema, RegisterUserDto } from '@/shared-types';
import { authService } from '../../services/auth.service';
import { cn } from '../../lib/utils';
import { User, Mail, Lock, Phone, ArrowRight, Users, Wrench, Building2, Home } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';

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
      <div className="hidden lg:flex relative flex-col justify-between bg-slate-950 p-12 overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-bl from-indigo-950/40 via-transparent to-transparent" />

        <Logo dark className="relative" />

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold text-white leading-tight"
          >
            One account, built for <span className="text-gradient">whoever you are</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-slate-300 max-w-sm"
          >
            Whether you live in a building, manage one, own one, or fix one — MERGE has an
            experience designed for you.
          </motion.p>
          <StaggerGroup className="mt-10 grid grid-cols-2 gap-4" stagger={0.08}>
            {roles.map(({ value, label, icon: Icon }) => (
              <StaggerItem key={value}>
                <div className="flex items-center gap-2 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 hover:bg-white/10 hover:border-indigo-400/30 transition-colors">
                  <Icon className="w-4 h-4 shrink-0 text-indigo-300" />
                  {label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <p className="relative text-xs text-slate-400">&copy; {new Date().getFullYear()} MERGE</p>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                className="bg-indigo-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto"
              >
                <Users className="w-7 h-7 text-indigo-600" />
              </motion.div>
              <h1 className="mt-5 text-xl font-bold text-slate-900">Registration successful!</h1>
              <p className="mt-2 text-sm text-slate-500">
                Please wait for admin verification, then log in to your new account.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:scale-[1.03] transition-all"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
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
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:bg-indigo-300 disabled:shadow-none inline-flex items-center justify-center gap-2"
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
