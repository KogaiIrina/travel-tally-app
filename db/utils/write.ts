import db from "..";

export default function write(
  sqlStatement: string,
  args?: (null | string | number)[]
): Promise<void> {
  return db.runAsync(sqlStatement, args || []).then(() => {});
}
