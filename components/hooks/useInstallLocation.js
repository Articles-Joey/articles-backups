import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useInstallLocation() {
  const { data, error, isLoading, mutate } = useSWR('/api/install-location', fetcher);

  return {
    data: data?.path ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}