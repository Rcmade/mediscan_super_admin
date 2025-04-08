import { useRouter, useSearchParams } from "next/navigation";
const useUpdateSearchParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (
    updates: Record<string, string | string[] | number | Date | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  return { updateSearchParams };
};

export default useUpdateSearchParams;
