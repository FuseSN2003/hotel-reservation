import { getBackendURL } from "./getBackendURL";

export const removeReserveRecord = async ( reservationId : string ) => {
  const formData = new FormData();
  formData.append("reservation_id", reservationId);

  const response = await fetch(
    `${getBackendURL()}/guest/rooms/preserve`,
    {
      method: "DELETE",
      body: formData,
    }
  );
  return response;
}