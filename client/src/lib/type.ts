export const employeeRole = [
  'administrator',
  'frontdesk',
  'house_keeping_manager',
  'house_keeping',
] as const;

export type EmployeeRole = (typeof employeeRole)[number];

export type User = {
  id: string;
  username: string;
  profile_picture: string;
  role: EmployeeRole;
};

export type Employee = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  role: EmployeeRole;
  profile_picture: string | null;
};

export type Room = {
  id: string;
  number: string;
  current_status:
    | 'vacant'
    | 'occupied'
    | 'maintenance'
    | 'off_market'
    | 'departing';
  room_type: string;
  price: number;
  picture_path: string;
};

export type RoomType = {
  id: string;
  name: string;
  capacity: number;
  detail: string;
  picture_path: string;
  price: number;
};
