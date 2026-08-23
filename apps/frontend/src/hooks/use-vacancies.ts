import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyVacancies, getPublishedVacancies } from '@/queries/vacancies';
import { createVacancy, setVacancyStatus, type CreateVacancyInput } from '@/mutations/vacancies';

export function useMyVacancies(landlordId: string | undefined) {
  return useQuery({
    queryKey: ['vacancies', landlordId],
    queryFn: () => getMyVacancies(landlordId!),
    enabled: !!landlordId,
  });
}

export function usePublishedVacancies() {
  return useQuery({ queryKey: ['published-vacancies'], queryFn: getPublishedVacancies });
}

export function useCreateVacancy(landlordId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVacancyInput) => createVacancy(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vacancies', landlordId] }),
  });
}

export function useSetVacancyStatus(landlordId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vacancyId, status }: { vacancyId: string; status: 'published' | 'archived' }) =>
      setVacancyStatus(vacancyId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vacancies', landlordId] }),
  });
}
