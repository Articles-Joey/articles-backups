import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useBackupTemplates() {
  const { data, error, isLoading, mutate } = useSWR('/api/templates/list', fetcher);

  return {
    templates: data?.templates ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}