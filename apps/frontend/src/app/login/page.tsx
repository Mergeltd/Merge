import type { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your MERGE account to manage maintenance requests, jobs, and your wallet.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
