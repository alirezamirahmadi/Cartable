import jwt from "jsonwebtoken";

const createToken = (data: { username: string }) => {
  const token = jwt.sign({ ...data }, process.env.privateKey ?? "0", {
    algorithm: "HS512",
    expiresIn: "24h",
  })
  return token;

}

export {
  createToken
}