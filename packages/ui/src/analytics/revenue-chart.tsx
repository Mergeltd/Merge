"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 5000 },
  { name: 'Feb', revenue: 7000 },
  { name: 'Mar', revenue: 6000 },
];

export const RevenueChart = () => (
  <div className="h-64 w-full bg-white p-4 rounded-xl border">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
