import { CreateMaintenanceRequestDto } from '@merge/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const maintenanceService = {
  async reportIssue(data: CreateMaintenanceRequestDto) {
    const response = await fetch(`${API_BASE_URL}/maintenance/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // TODO: Add auth token
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to report maintenance issue');
    }

    return response.json();
  },
};
