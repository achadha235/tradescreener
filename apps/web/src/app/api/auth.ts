import jwt from "jsonwebtoken";

interface DataPayload {
  [key: string]: any;
}

export function encrypt(data: DataPayload, secret: string): string {
  const token = jwt.sign(data, secret);
  return token;
}

export function decrypt(token: string, secret: string): DataPayload {
  try {
    const decoded = jwt.verify(token, secret) as DataPayload;
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
