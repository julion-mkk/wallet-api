import rateLimit from "../config/upstach.js";

const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await rateLimit.limit('my-rate-limiter');
        if(!success) {
            return res.status(429).json({message: "Too many requests. Please try again later."});
        }
        next();
    }catch (error) {
        console.error("Rate limiter error:", error);
        next(error);
    }
}
export default rateLimiter;
