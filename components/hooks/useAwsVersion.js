import useSWRImmutable from 'swr/immutable';

const fetcher = url => fetch(url).then(res => res.json());

export default function useAwsVersion() {
    const { data, error, isLoading } = useSWRImmutable('/api/aws/version', fetcher);
    return {
        version: data?.data,
        isLoading,
        isError: error
    };
}