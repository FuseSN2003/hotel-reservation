import { join } from "path";
import Elysia from "elysia";

export const fileRoute = new Elysia({ prefix: "/file" }).get(
  "/:id",
  async ({ params, set }) => {
    const { id } = params;
    const path = join(".", process.env.UPLOAD_FOLDER!, id);

    const fileContent = Bun.file(path);

    set.headers["content-type"] = fileContent.type;
    return fileContent;
  }
);
