import { getToken } from "next-auth/jwt"

import type { NextApiRequest } from "next"
import type { JWT } from "next-auth/jwt"

export const getJwtToken = async (req: NextApiRequest): Promise<JWT | null> => {
   const secret = process.env.NEXTAUTH_SECRET

   return await getToken({
      req,
      secret
   })
}