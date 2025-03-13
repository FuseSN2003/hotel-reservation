import { employeeRole } from './type';
import { z } from 'zod';

export const PasswordMatchSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type PasswordMatchValues = z.infer<typeof PasswordMatchSchema>;

const BaseEmployeeSchema = z.object({
  username: z
    .string()
    .min(1, 'username is required')
    .max(15, 'username must be less than 15 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/[0-9]/, 'Phone number must be number')
    .refine((value) => value.length === 10, {
      message: 'Phone number must be 10 digits',
    }),
  role: z.enum(employeeRole),
});

export const CreateAccountEmployeeSchema = BaseEmployeeSchema.extend({
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((value) => value.size !== 0, {
      message: 'Image is required',
    }),
}).and(PasswordMatchSchema);

export type CreateAccountEmployeeValues = z.infer<
  typeof CreateAccountEmployeeSchema
>;

export const EditAccountEmployeeSchema = BaseEmployeeSchema.extend({
  image: z.instanceof(File).optional(),
});

export type EditAccountEmployeeValues = z.infer<
  typeof EditAccountEmployeeSchema
>;

export const RoomSchema = z.object({
  number: z
    .string()
    .regex(/[0-9]/, 'Room number must be number')
    .min(1, 'Room number is required'),
  type_id: z.string().min(1, 'Room type is required'),
});

export type RoomValues = z.infer<typeof RoomSchema>;

const BaseRoomTypeSchema = z.object({
  name: z.string().min(1, 'Room type name is required'),
  price: z.coerce.number().min(1, 'Price is required'),
  capacity: z.coerce.number().min(1, 'Capacity is required'),
  detail: z.string().min(1, 'Detail is required'),
});

export const AddRoomTypeSchema = BaseRoomTypeSchema.extend({
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((value) => value.size !== 0, {
      message: 'Image is required',
    }),
});

export type AddRoomTypeValues = z.infer<typeof AddRoomTypeSchema>;

export const EditRoomTypeSchema = BaseRoomTypeSchema.extend({
  image: z.instanceof(File).optional(),
});

export type EditRoomTypeValues = z.infer<typeof EditRoomTypeSchema>;
