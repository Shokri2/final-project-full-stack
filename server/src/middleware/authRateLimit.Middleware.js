import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler:(req,res)=>{
  return res.status(429).json({
    sucsses:false,
    message:"to many login attempts", error:"rate limit error"
  })
  },
 
});
