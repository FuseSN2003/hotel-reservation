import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

type UploadFileResult =
  | { status: 'error'; message: string }
  | { status: 'success'; url: string };

export const uploadFile = async (file: File): Promise<UploadFileResult> => {
  if (!process.env.UPLOAD_FOLDER) {
    return {
      status: 'error',
      message: 'Upload folder is not set',
    };
  }

  if (!file.size || file.size === 0) {
    return {
      status: 'error',
      message: 'File is empty',
    };
  }

  const date = new Date();

  const fileName = `${uuidv4()}-${date.getDate()}-${date.getMonth()}.${
    file.type.split('/')[1]
  }`;
  const path = join('.', process.env.UPLOAD_FOLDER!, fileName);
  const url = `/file/${fileName}`;

  await Bun.write(path, file);

  return {
    status: 'success',
    url,
  };
};
