export const config = { runtime: "experimental-edge", }

export default async function handler(): Promise<Response> {
   return new Response(
      JSON.stringify({ name: "Jim Beam", }),
      {
         status: 200,
         headers: { "content-type": "application/json", },
      }
   )
}