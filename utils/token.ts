import jwt from "jsonwebtoken";

const createToken = (data: { username: string }) => {
  const token = jwt.sign({ ...data }, process.env.privateKey ?? "", {
    algorithm: "HS512",
    expiresIn: "24h",
  })
  return token;
}

const verifyToken = (token: string) => {
  try {
    const tokenPayload = jwt.verify(token, process.env.privateKey ?? "")
    return tokenPayload;
  }
  catch (error) {
    return error;
  }
}

export {
  createToken,
  verifyToken
}