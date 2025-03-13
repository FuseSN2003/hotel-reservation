import { sql } from './db';
import { getDiffDate } from './get-diff-date';

type Arguements = {
  type_id: string;
  check_in: Date;
  check_out: Date;
};

export default async function getVacantRoom({
  type_id,
  check_in,
  check_out,
}: Arguements) {
  const diffDate = getDiffDate(new Date(check_in), new Date(check_out));

  const [res] = await sql`
                        SELECT
                        room_types."name",
                        ${diffDate} * room_types.price AS total_price,
                        price,
                        room_types.detail,
                        room_types.id AS type_id,
                        room_types.picture_path,
                        rooms."id" AS room_id
                        FROM
                          rooms
                          LEFT JOIN room_types ON rooms.type_id = room_types."id" 
                        WHERE
                          (
                          SELECT
                            reservations."id" 
                          FROM
                            reservations
                          WHERE
                            reservations.room_id = rooms."id" 
                            AND (
                              ( ( ( ${check_out} ) > reservations.check_in ) AND ( ( ${check_in} ) < reservations.check_out ) ) 
                              OR ( ( ( ${check_in} ) < reservations.check_out ) AND ( ( ${check_out} ) > reservations.check_in ) ) 
                              OR ( ( ( ${check_in} ) > reservations.check_in ) AND ( ( ${check_out} ) < reservations.check_out ) ) 
                              OR ( ( ( ${check_out} ) > reservations.check_out ) AND ( ( ${check_in} ) < reservations.check_in ) ) 
                            ) 
                            LIMIT 1 
                          ) IS NULL 
                          AND rooms.type_id = ${type_id}
                        ORDER BY
                          rooms."number" ASC
                          LIMIT 1;
    `;
  return res;
}
