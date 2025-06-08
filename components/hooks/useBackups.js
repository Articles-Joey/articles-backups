import { useSiteStore } from '../stores/useSiteStore';
import useSWR from 'swr';

function buildQuery(storageLocations) {
  if (!storageLocations || storageLocations.length === 0) return '';
  return '?storageLocations=' + encodeURIComponent(JSON.stringify(storageLocations));
}

const fetcher = (url) => fetch(url).then(res => res.json());

export function useBackups() {
  const storageLocations = useSiteStore(s => s.storageLocations);
  const query = buildQuery(storageLocations);
  const url = '/api/backups/list' + query;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data: data?.backups ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}