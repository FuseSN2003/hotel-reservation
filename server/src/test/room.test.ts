import { describe, expect, it } from 'bun:test';
import { app } from '@/index';

let room_id;
let toDeleteRoomID: string;
const updateRoomIdTarget = '2d317330-1d5a-42e7-90c1-2c62f589737e';

describe('Elysia', () => {
  it('[create-room] wrong number format', async () => {
    // number need four digits
    const formData = new FormData();

    formData.append('number', '1234');
    formData.append('type_id', '');

    const response = await app
      .handle(
        new Request(`${process.env.HOST_NAME}/admin/rooms/`, {
          method: 'POST',
          body: formData,
        })
      )
      .then((res) => res);

    expect(response.status).toBe(400);
  });

  it('[create-room] wrong type id format.', async () => {
    const formData = new FormData();

    formData.append('number', '123');
    formData.append('type_id', 'wrong-uuid');

    const response = await app
      .handle(
        new Request(`${process.env.HOST_NAME}/admin/rooms/`, {
          method: 'POST',
          body: formData,
        })
      )
      .then((res) => res);

    expect(response.status).toBe(400);
  });

  it('[create-room] wrong type id and number format.', async () => {
    const formData = new FormData();

    formData.append('number', '1234');
    formData.append('type_id', 'wrong-uuid');

    const response = await app
      .handle(
        new Request(`${process.env.HOST_NAME}/admin/rooms/`, {
          method: 'POST',
          body: formData,
        })
      )
      .then((res) => res);

    expect(response.status).toBe(400);
  });

  it('[create-room] right-format', async () => {
    const formData = new FormData();

    formData.append('number', '457');
    formData.append('type_id', 'b0ea90de-1c75-408f-8ff4-7e246a46c480');

    const response = await app
      .handle(
        new Request(`${process.env.HOST_NAME}/admin/rooms/`, {
          method: 'POST',
          body: formData,
        })
      )
      .then((res) => res);

    room_id = (await response.json()).room_id;
    toDeleteRoomID = room_id;
    expect(response.status).toBe(201);
  });

  it('[get-room] get all.', async () => {
    const response = await app.handle(
      new Request(`${process.env.HOST_NAME}/admin/rooms/`, {
        method: 'GET',
      })
    );

    expect(response.status).toBe(200);
  });

  it('[get-room] get by id.', async () => {
    const response = await app.handle(
      new Request(
        `${process.env.HOST_NAME}/admin/rooms/${updateRoomIdTarget}`,
        { method: 'GET' }
      )
    );

    expect(response.status).toBe(200);
  });

  it('[get-room] get by wrong id.', async () => {
    const response = await app.handle(
      new Request(`${process.env.HOST_NAME}/admin/rooms/wrong-id`, {
        method: 'GET',
      })
    );

    expect(response.status).toBe(400);
  });

  it('[update-room] wrong data format', async () => {
    // number need four digits
    const formData = new FormData();

    formData.append('number', '1234');
    formData.append('type_id', 'wrong-uuid');

    const response = await app
      .handle(
        new Request(
          `${process.env.HOST_NAME}/admin/rooms/${updateRoomIdTarget}`,
          {
            method: 'PUT',
            body: formData,
          }
        )
      )
      .then((res) => res);

    expect(response.status).toBe(400);
  });

  it('[update-room] duplicate room number', async () => {
    const formData = new FormData();
    const roomID = '41594a56-a1f6-4f4f-b4f4-9d1acb48c1f5';

    formData.append('number', '101');
    formData.append('type_id', 'b0ea90de-1c75-408f-8ff4-7e246a46c480');

    const response = await app.handle(
      new Request(`${process.env.HOST_NAME}/admin/rooms/${roomID}`, {
        method: 'PUT',
        body: formData,
      })
    );

    expect(response.status).toBe(400);
  });

  it('[update-room] right data format', async () => {
    const formData = new FormData();

    formData.append('number', '101');
    formData.append('type_id', 'b0ea90de-1c75-408f-8ff4-7e246a46c480');

    const response = await app
      .handle(
        new Request(
          `${process.env.HOST_NAME}/admin/rooms/${updateRoomIdTarget}`,
          {
            method: 'PUT',
            body: formData,
          }
        )
      )
      .then((res) => res);

    expect(response.status).toBe(200);
  });

  it('[delete-room] wrong id format', async () => {
    const response = await app.handle(
      new Request(`${process.env.HOST_NAME}/admin/rooms/wrong-id`, {
        method: 'DELETE',
      })
    );

    expect(response.status).toBe(400);
  });

  it('[delete-room] right id format', async () => {
    const response = await app.handle(
      new Request(`${process.env.HOST_NAME}/admin/rooms/${toDeleteRoomID}`, {
        method: 'DELETE',
      })
    );

    expect(response.status).toBe(200);
  });
});
