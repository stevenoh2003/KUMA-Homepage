import { AppPropsWithLayout } from "../types";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { RootLayout } from "src/layouts";
import { queryClient } from "src/libs/react-query";
import "../styles/globals.css";
import "../styles/styles.css"
import { AuthProvider } from '../context/auth-context'; // Adjust the path as necessary
import { SessionProvider } from "next-auth/react";
import { useState, useEffect, startTransition } from 'react';

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Let's say we delay the rendering of the layout until some condition is met
    startTransition(() => {
      setReady(true); // This state update is deferred until priority updates are done
    });
  }, []);

  if (!ready) {
    return <div>loading</div>; // Hypothetical loading component
  }

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider>
            <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;