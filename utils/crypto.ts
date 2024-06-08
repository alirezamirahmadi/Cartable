import { hash } from "bcrypt";

const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export {
  hashPassword
}