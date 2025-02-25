export type Reservation = {
   reservations_id: string;
   customer_id: string;
   first_name: string;
   last_name: string;
   address: string;
   email: string;
   phone_number: string;
   sub_district: string | null;
   district: string | null;
   province: string | null;
   postcode: string | null;
   room_number: string;
   price: number;
   room_id: string;
   check_in: Date;
   check_out: Date;
   display_color: string;
   transaction_status: string;
   created_at: string;
   current_status: string;
   types_name: string;
   capacity: number;
   detail: string;
   picture_path: string;
   price_per_night: number;
   special_request: string;
   type_id: string;
};

export type Room = {
   id: string;
   number: string;
   current_status: string;
   detail: string;
   picture_path: string;
   price: number;
   capacity: number;
};

export type allRooms = {
   [key: string]: Room[];
};

export type RoomType = {
   id: string;
   name: string;
   detail: string;
   capacity: number;
   price: number;
   picture_path: string;
};
