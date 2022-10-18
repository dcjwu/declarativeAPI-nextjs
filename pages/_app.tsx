import React from "react"

import { CssBaseline } from "@mui/material"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import type { AppProps } from "next/app"

const MyApp = ({
   Component,
   pageProps: { session, ...pageProps }
}: AppProps<{session: Session}>): JSX.Element => {

   return (
      <React.Fragment>

         <CssBaseline/>
         <SessionProvider session={session}>
            <Component {...pageProps}/>
         </SessionProvider>

      </React.Fragment>
   )
}

export default MyApp
