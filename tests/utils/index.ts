import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.clear();
  }
};

export const isJwt = (token: string | null): boolean => {
  if (!token) return false;
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    return false;
  }
  try {
    tokenParts.forEach(part => {
      // check if the parts are valid base64 token or not, if not it will give error, means the token is not valid
      Buffer.from(part, "base64").toString("utf-8");
    });
    return true;
  } catch (err) {
    return false;
  }
};
