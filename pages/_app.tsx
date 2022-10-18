import React from "react"

import { CssBaseline } from "@mui/material"

import type { AppProps } from "next/app"

const MyApp = ({
   Component,
   pageProps
}: AppProps): JSX.Element => {

   return (
      <React.Fragment>

         <CssBaseline/>
         <Component {...pageProps}/>

      </React.Fragment>
   )
}

export default MyApp
