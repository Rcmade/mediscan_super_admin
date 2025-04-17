import { decrypt, encrypt } from "./cryptoUtils";

type AppointmentIds = {
  id: string;
};
export const encryptAppointmentIds = (ids: AppointmentIds[]) => {
  const encryptedIds = encrypt(ids);
  return encryptedIds;
};

export const decryptAppointmentIds = (encryptedIds: string) => {
  const decryptedIds = decrypt(encryptedIds);
  return decryptedIds as AppointmentIds[];
};
