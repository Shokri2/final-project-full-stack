import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    const autherization = req.headers.authorization;
    if (!autherization || !autherization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "anauthorized!" });
    }

    const token = autherization.split(" ")[1];

    const payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET, {
      issuer: "my-api",
      audience: "my-client",
    });

    if (payload.type !== "access") {
      return res.status(401).json({ message: "invalid tokens type!" });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
