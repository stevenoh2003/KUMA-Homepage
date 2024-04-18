import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { queryClient } from "src/libs/react-query"
import "../styles/globals.css"
import Head from "next/head" // Import the Head component

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          {/* Add the font link in the Head */}

        </Head>
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
