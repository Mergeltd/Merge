'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginDto } from '@merge/types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      const { accessToken } = await authService.login(data);
      localStorage.setItem('accessToken', accessToken);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input {...register('email')} placeholder="Email" className="border p-2 w-full" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <input {...register('password')} type="password" placeholder="Password" className="border p-2 w-full" />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
    </form>
  );
}
