import "@/styles/globals.css";
// import "@/styles/styles.css";
import { useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { HMSRoomProvider } from "@100mslive/react-sdk";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

import ResizeHandler from "@components/resize-handler";
import BackgroundBeams from "@components/ui/background-beams";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { setHeaderName, setLoggedIn } from "@/apollo/reactive-store";
import { ThemeProvider } from "@/components/theme-provider";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";
import apolloClient from "@/apollo/apollo-client";
import * as Sentry from "@sentry/react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";
import { Spinner } from "@/components/ui/spinner";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { corsHeaders } from "@/helpers/corsHeaders";
import { __DEV__, botName, DEV_AUTH_BYPASS } from "@/utils/constants";
import { ErrorBoundary } from "@/components/error-boundary";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  maxBreadcrumbs: 50,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // integrations: [Sentry.captureConsoleIntegration()],
});

// const huddleClient = new HuddleClient({
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
//   options: {
//     activeSpeakers: {
//       size: 8,
//     },
//   },
// });

// Authorization: token
//         ? `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
//         : "",

export const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ("nodeId" in responseObject) {
      return `${responseObject.nodeId}`;
    }

    return defaultDataIdFromObject(responseObject);
  },
  typePolicies: {
    Query: {
      fields: {
        node: {
          read(_, { args, toReference }) {
            const ref = toReference({
              nodeId: args?.nodeId,
            });

            return ref;
          },
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { toast } = useToast();

  // 🕉️ Use the properly configured Apollo client from apollo-client.ts directly
  useEffect(() => {
    setHeaderName("");
  }, [router, toast]);

  // const clearCache = useCallback(() => {
  //   if (!persistor) {
  //     return;
  //   }
  //   persistor.purge();
  // }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  console.log(
    "🕉️ _app.tsx: apolloClient =",
    !!apolloClient,
    "DEV_AUTH_BYPASS =",
    DEV_AUTH_BYPASS
  );

  // 🚀 В DEV_AUTH_BYPASS режиме всегда продолжаем работу
  if (!apolloClient && !DEV_AUTH_BYPASS) {
    console.log("🕉️ _app.tsx: Apollo client not ready, showing spinner");
    return <Spinner size="lg" />;
  }

  const AppContent = () => (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TonConnectUIProvider
            manifestUrl="https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/docs/tonconnect-manifest.json"
            actionsConfiguration={{
              twaReturnUrl: `https://t.me/${botName}/start`,
            }}
          >
            {/* <Analytics />
            <SpeedInsights /> */}
            {!__DEV__ && <BackgroundBeams />}
            <HMSRoomProvider>
              <Component {...pageProps} />

              <ResizeHandler />
              <Toaster />
            </HMSRoomProvider>
            {/* <BackgroundBeamsTwo /> */}
          </TonConnectUIProvider>
        </ThemeProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );

  return (
    <main className="dark text-foreground bg-background">
      <ErrorBoundary>
        <div>
          {/* <HuddleProvider client={huddleClient}> */}
          {apolloClient ? (
            <ApolloProvider client={apolloClient}>
              <AppContent />
            </ApolloProvider>
          ) : (
            <AppContent />
          )}
          {/* </HuddleProvider> */}
        </div>
      </ErrorBoundary>
    </main>
  );
}
