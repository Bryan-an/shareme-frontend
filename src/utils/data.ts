export const userQuery = (userId: string) => {
  return `*[_type == "user" && _id == '${userId}']`;
};
