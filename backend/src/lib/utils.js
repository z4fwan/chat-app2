import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,                 // prevent client-side JS from reading the cookie
    sameSite: "none",               // required for cross-site cookies
    secure: true                    // only send cookie over HTTPS
  });

  return token;
};
