import { rateLimit } from "express-rate-limit"

export const sendingEmailLimit = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 60 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message:'try again later',
})