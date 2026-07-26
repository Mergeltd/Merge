import type { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Create an Account',
  description:
    'Create your MERGE account as a resident, technician, property manager, or landlord.',
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
