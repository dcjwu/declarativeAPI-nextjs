import NextCors from "nextjs-cors"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextFunction } from "next-api-decorators"

export const CorsMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction): Promise<void> => {
   await NextCors(req, res, {
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
      origin: "https://edge-fn-cors-test-hk8l8rnh4-dcjwu.vercel.app/",
   })

   next()
}