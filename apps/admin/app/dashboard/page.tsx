"use client";
import React from 'react';
import { RevenueChart } from '../../../components/analytics/revenue-chart';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <RevenueChart />
        </div>
      </div>
    </div>
  );
}
