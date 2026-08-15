'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginDto } from '@/shared-types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Mail, Lock, ShieldCheck, Wrench, Wallet, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';

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
      <div className="hidden lg:flex relative flex-col justify-between bg-slate-950 p-12 overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-transparent" />

        <Logo dark className="relative" />

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold text-white leading-tight"
          >
            Welcome back to your <span className="text-gradient">property ecosystem</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-slate-300 max-w-sm"
          >
            Log in to manage maintenance requests, track jobs, and stay connected with your
            community.
          </motion.p>
          <StaggerGroup className="mt-10 space-y-4" stagger={0.1}>
            {highlights.map(({ icon: Icon, text }) => (
              <StaggerItem key={text}>
                <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 hover:bg-white/10 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-indigo-300" />
                  </span>
                  {text}
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

          <h1 className="text-2xl font-bold text-slate-900">Log in to MERGE</h1>
          <p className="text-slate-500 text-sm mt-2">Welcome back — enter your details below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="relative group/field">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  {...register('email')}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                    errors.email ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10'
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
              <div className="relative group/field">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  {...register('password')}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-md text-sm outline-none transition-all',
                    errors.password ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10'
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:bg-indigo-300 disabled:shadow-none inline-flex items-center justify-center gap-2"
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
