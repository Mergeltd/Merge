"use client";
import { UnitGrid } from '../../components/apartment/unit-grid';

const mockUnits = [
  { id: '1', number: '101', status: 'VACANT' as const },
  { id: '2', number: '102', status: 'OCCUPIED' as const },
  { id: '3', number: '103', status: 'MAINTENANCE' as const },
  { id: '4', number: '104', status: 'VACANT' as const },
];

export default function PropertyManagerDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Property Manager Dashboard</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Building A - Unit Status</h2>
        <UnitGrid units={mockUnits} />
      </div>
    </div>
  );
}
