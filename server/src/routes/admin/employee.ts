import { sql } from '@/libs/db';
import Elysia from 'elysia';
import {
  addEmployeeSchema,
  ResetPasswordSchema,
  updateEmployeeSchema,
} from '@/libs/validation';
import { join } from 'path';
import { unlink } from 'node:fs/promises';
import { uploadFile } from '@/libs/upload-file';
import { middleware } from '@/middleware';

export const employeeRoutes = new Elysia({ prefix: '/employees' })
  .use(middleware)
  .get('/', async ({ user, set, query }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const q = query.q?.toLowerCase() || '';

    const employees =
      await sql`SELECT id, username, first_name, last_name, date_of_birth, role, profile_picture, phone_number 
            FROM employees
            WHERE LOWER(username) LIKE ${`%${q}%`}
            OR LOWER(first_name) LIKE ${`%${q}%`}
            OR LOWER(last_name) LIKE ${`%${q}%`}
            `;

    return {
      status: 'success',
      data: employees,
    };
  })
  .get('/:id', async ({ params: { id }, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const employee = await sql`SELECT * FROM employees WHERE id=${id}`;
    if (employee.length === 0) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Employee not found',
      };
    }
    return {
      status: 'success',
      data: employee[0],
    };
  })
  .post('/', async ({ body, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const validateData = addEmployeeSchema.safeParse(body);
    if (!validateData.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validateData.error.errors[0].message,
      };
    }
    const {
      username,
      first_name,
      last_name,
      date_of_birth,
      password,
      role,
      phone_number,
      image,
    } = validateData.data;

    const IsEmployeeExist =
      await sql`SELECT * FROM employees WHERE username=${username.toLowerCase()}`;

    if (IsEmployeeExist.length > 0) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Employee already exists',
      };
    }

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const uploadResult = await uploadFile(image);
    if (uploadResult.status === 'error') {
      set.status = 400;
      return {
        status: 'error',
        message: uploadResult.message,
      };
    }

    const queryRoles = await sql`SELECT enum_range(NULL::role);`;
    const allRole = Object.values(queryRoles[0].enum_range);
    if (!allRole.includes(role)) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Role does not exist',
      };
    }

    await sql`INSERT INTO employees 
        (username, first_name, last_name, date_of_birth, password, role , profile_picture, phone_number) 
        VALUES (${username.toLowerCase()}, ${first_name}, ${last_name}, ${date_of_birth}, ${hashedPassword}, ${role}, ${uploadResult.url}, ${phone_number})`;

    return {
      status: 'success',
      message: 'Employee added successfully',
    };
  })
  .put('/:id', async ({ params: { id }, body, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const validateData = updateEmployeeSchema.safeParse(body);
    if (!validateData.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validateData.error.errors[0].message,
      };
    }
    const {
      username,
      first_name,
      last_name,
      date_of_birth,
      role,
      image,
      phone_number,
    } = validateData.data;

    const [existsingEmployee] =
      await sql`SELECT * FROM employees WHERE id=${id}`;
    if (!existsingEmployee) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Employee not found',
      };
    }

    let url = existsingEmployee.profile_picture;
    if (image && image.size > 0) {
      const uploadResult = await uploadFile(image);
      if (uploadResult.status === 'error') {
        set.status = 400;
        return {
          status: 'error',
          message: uploadResult.message,
        };
      }

      const path = join(
        '.',
        process.env.UPLOAD_FOLDER!,
        existsingEmployee.profile_picture.split('/').pop()
      );
      await unlink(path);

      url = uploadResult.url;
    }

    const queryRoles = await sql`SELECT enum_range(NULL::role);`;
    const allRole = Object.values(queryRoles[0].enum_range);
    if (!allRole.includes(role)) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Role does not exist',
      };
    }

    await sql`UPDATE employees SET username=${username}, first_name=${first_name}, last_name=${last_name}, date_of_birth=${date_of_birth}, role=${role} , profile_picture=${url}, phone_number=${phone_number} WHERE id=${id}`;

    return {
      status: 'success',
      message: 'Employee updated successfully',
    };
  })
  .delete('/:id', async ({ params: { id }, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const [employee] = await sql`SELECT * FROM employees WHERE id=${id}`;

    if (!employee) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Employee not found',
      };
    }

    await sql`DELETE FROM employees WHERE id=${id}`;

    return {
      status: 'success',
      message: 'Employee deleted successfully',
    };
  });

export const resetPasswordRoutes = new Elysia({
  prefix: '/reset-password',
})
  .use(middleware)
  .put('/:id', async ({ params: { id }, body, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator' && user.id !== id) {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const validateData = ResetPasswordSchema.safeParse(body);
    if (!validateData.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validateData.error.errors[0].message,
      };
    }
    const { password, confirm_password } = validateData.data;

    const employee = await sql`SELECT * FROM employees WHERE id=${id}`;
    if (employee.length === 0) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Employee not found',
      };
    }
    if (password !== confirm_password) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Password and confirm password does not match',
      };
    }
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });
    await sql`UPDATE employees SET password=${hashedPassword} WHERE id=${id}`;
    return {
      status: 'success',
      message: 'Password updated successfully',
    };
  });
