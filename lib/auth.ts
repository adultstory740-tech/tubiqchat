import jwt from "jsonwebtoken";

export function getUserId(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) return null;

  const token = auth.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    return decoded.guestId;
  } catch {
    return null;
  }
}
