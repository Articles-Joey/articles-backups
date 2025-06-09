import useSWR from 'swr';

const fetcher = (url, s3Uri) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ s3Uri }),
  }).then(res => res.json());

export function useBackupsAwsS3(s3Uri) {
  const shouldFetch = !!s3Uri && s3Uri.startsWith('s3://');
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['/api/aws/list', s3Uri] : null,
    ([url, s3Uri]) => fetcher(url, s3Uri)
  );

  return {
    data: data?.files || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
