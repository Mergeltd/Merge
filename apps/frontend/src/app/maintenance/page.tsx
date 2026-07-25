"use client";
import React from 'react';
import { MaintenanceRequestForm } from '../../components/maintenance/request-form';

export default function MaintenancePage() {
  // In a real scenario, these would come from the authenticated user context
  const mockParams = {
    residentId: '550e8400-e29b-41d4-a716-446655440000',
    unitId: '670e8400-e29b-41d4-a716-446655440000',
    categoryId: '770e8400-e29b-41d4-a716-446655440000'
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report Maintenance Issue</h1>
      <MaintenanceRequestForm {...mockParams} />
    </div>
  );
}
