import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/dist/next-server/lib/router/router'

function App ({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
