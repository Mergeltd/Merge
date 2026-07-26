"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-indigo-600 mx-auto" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Thanks, {values.name.split(' ')[0] || 'there'}!</h3>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ve received your message and our team will get back to you shortly.
        </p>
      </motion.div>
    );
  }

  const inputClass = cn(
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all',
    'focus:border-indigo-500 focus:bg-white'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-medium text-slate-700">Full Name</label>
          <input
            id="name"
            required
            value={values.name}
            onChange={handleChange('name')}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium text-slate-700">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange('email')}
            className={inputClass}
            placeholder="jane@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-xs font-medium text-slate-700">Subject</label>
        <input
          id="subject"
          required
          value={values.subject}
          onChange={handleChange('subject')}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-medium text-slate-700">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={values.message}
          onChange={handleChange('message')}
          className={inputClass}
          placeholder="Tell us a bit more..."
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
