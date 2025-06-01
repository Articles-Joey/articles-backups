import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useBackups() {
  const { data, error, isLoading, mutate } = useSWR('/api/backups/list', fetcher);

  return {
    data: data?.backups ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}