import db from "..";

export default function read<T>(
  sqlStatement: string,
  args?: (null | string | number)[]
): Promise<T[]> {
  return db.getAllAsync(sqlStatement, args || []) as Promise<T[]>;
}
