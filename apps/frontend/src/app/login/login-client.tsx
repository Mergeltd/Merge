'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginDto } from '@merge/types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Mail, Lock, ShieldCheck, Wrench, Wallet, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

const highlights = [
  { icon: ShieldCheck, text: 'ID-verified technicians on every job' },
  { icon: Wrench, text: 'Real-time tracking from request to resolved' },
  { icon: Wallet, text: 'Secure escrow payments, no cash needed' },
];

export default function LoginClient() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    setFormError(null);
    try {
      const { accessToken } = await authService.login(data);
      localStorage.setItem('accessToken', accessToken);
      router.push('/dashboard');
    } catch (error) {
      setFormError('We couldn’t log you in with those details. Please try again.');
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between bg-indigo-600 p-12 overflow-hidden">
        <div aria-hidden className="absolute -top-32 -left-16 w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl" />

        <Logo dark className="relative" />

        <div className="relative">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Welcome back to your property ecosystem
          </h2>
          <p className="mt-4 text-indigo-100 max-w-sm">
            Log in to manage maintenance requests, track jobs, and stay connected with your
            community.
          </p>
          <div className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                {text}
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

          <h1 className="text-2xl font-bold text-slate-900">Log in to MERGE</h1>
          <p className="text-slate-500 text-sm mt-2">Welcome back — enter your details below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  {...register('email')}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                    errors.email ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <span className="text-xs text-slate-400">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  {...register('password')}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                    errors.password ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
