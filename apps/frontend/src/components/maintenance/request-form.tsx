"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateMaintenanceRequestSchema, CreateMaintenanceRequestDto } from '@merge/types';
import { cn } from '@/lib/utils';

import { maintenanceService } from '@/services/maintenance.service';

export const MaintenanceRequestForm = ({ residentId, unitId, categoryId }: { residentId: string; unitId: string; categoryId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaintenanceRequestDto>({
    resolver: zodResolver(CreateMaintenanceRequestSchema),
    defaultValues: { residentId, unitId, categoryId }
  });

  const onSubmit = async (data: CreateMaintenanceRequestDto) => {
    try {
      await maintenanceService.reportIssue(data);
      alert('Maintenance request submitted successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded-xl border border-slate-200">
      <input type="hidden" {...register('residentId')} />
      <input type="hidden" {...register('unitId')} />
      <input type="hidden" {...register('categoryId')} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Issue Title</label>
        <input {...register('title')} className="w-full p-2 border rounded" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea {...register('description')} className="w-full p-2 border rounded" rows={4} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Urgency</label>
        <select {...register('urgency')} className="w-full p-2 border rounded">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-indigo-600 text-white rounded">
        {isSubmitting ? 'Submitting...' : 'Report Issue'}
      </button>
    </form>
  );
};
