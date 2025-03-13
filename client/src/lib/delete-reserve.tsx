export const removeReserveRecord = async (reservationId: string) => {
  const formData = new FormData();
  formData.append('reservation_id', reservationId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/guest/rooms/preserve`,
    {
      method: 'DELETE',
      body: formData,
    }
  );
  return response;
};
