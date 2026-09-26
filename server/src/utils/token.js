import jwt from "jsonwebtoken";

export const generateAcessTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      type: "access",
      
    },

    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: "my-api",
      audience: "my-client",
      
    },
    
  );
};

export const generateRefreshTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
 
      type: "refresh",
     
    },

    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "my-api",
      audience: "my-client",
    },
  );
};
