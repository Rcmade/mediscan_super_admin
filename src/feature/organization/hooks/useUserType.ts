import { useGetOrgDetailsByWebName } from "./useGetOrgByWebName";

const useUserType = () => {
  const { data: orgDetails } = useGetOrgDetailsByWebName();

  const userType = orgDetails?.orgType === "HOSPITAL" ? "Patient" : "Customer";

  return userType;
};

export default useUserType;
