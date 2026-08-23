import { useQuery } from '@tanstack/react-query';
import { getAllUnits, getAllBuildings } from '@/queries/units';

export function useAllUnits() {
  return useQuery({ queryKey: ['admin-units'], queryFn: getAllUnits });
}

export function useAllBuildings() {
  return useQuery({ queryKey: ['admin-buildings'], queryFn: getAllBuildings });
}
