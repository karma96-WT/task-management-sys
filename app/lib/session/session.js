import { cookies } from "next/headers";

export const sessionOptions = {
  password: process.env.SECRET_KEY,
  cookieName: "task-management-user-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};