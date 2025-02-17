import '@/styles/globals.css'
// import "@/styles/styles.css";
import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { HeroUIProvider } from '@heroui/react'
import { HMSRoomProvider } from '@100mslive/react-sdk'
import { EnvProvider } from '@/env/provider'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

import ResizeHandler from '@components/resize-handler'
import BackgroundBeams from '@components/ui/background-beams'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { setHeaderName } from '@/apollo/reactive-store'
import { ThemeProvider } from '@/components/theme-provider'

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  defaultDataIdFromObject,
} from '@apollo/client'
import * as Sentry from '@sentry/react'
import { useRouter } from 'next/router'
import { useToast } from '@/components/ui/use-toast'

import { setContext } from '@apollo/client/link/context'
import { Spinner } from '@/components/ui/spinner'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { corsHeaders } from '@/helpers/corsHeaders'
import {
  botName,
  isDev,
  NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from '@/config'
import { ErrorBoundary } from '@/components/error-boundary'

if (isDev) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

Sentry.init({
  dsn: NEXT_PUBLIC_SENTRY_DSN,
  maxBreadcrumbs: 50,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // integrations: [Sentry.captureConsoleIntegration()],
})

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
    if ('nodeId' in responseObject) {
      return `${responseObject.nodeId}`
    }

    return defaultDataIdFromObject(responseObject)
  },
  typePolicies: {
    Query: {
      fields: {
        node: {
          read(_, { args, toReference }) {
            const ref = toReference({
              nodeId: args?.nodeId,
            })

            return ref
          },
        },
      },
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  // const [persistor, setPersistor] =
  //   useState<CachePersistor<NormalizedCacheObject>>();

  useEffect(() => {
    async function init() {
      // let newPersistor = new CachePersistor({
      //   cache,
      //   storage: new LocalStorageWrapper(window.localStorage),
      //   debug: true,
      //   trigger: "write",
      // });
      // await newPersistor.restore();
      // setPersistor(newPersistor);
      setHeaderName('')
      const httpLink = createHttpLink({
        uri: `${NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      })

      const authLink = setContext(async (_, { headers }) => {
        //const token = (await supabase.auth.getSession()).data.session?.access_token;

        return {
          headers: {
            ...corsHeaders,
            apiKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        }
      })

      setClient(
        new ApolloClient({
          link: authLink.concat(httpLink),
          cache,
          connectToDevTools: true,
        })
      )
    }

    init().catch(console.error)
  }, [router, toast])

  // const clearCache = useCallback(() => {
  //   if (!persistor) {
  //     return;
  //   }
  //   persistor.purge();
  // }, [persistor]);

  // const reload = useCallback(() => {
  //   window.location.reload()
  // }, [])

  if (!client) {
    return <Spinner size='lg' />
  }

  return (
    <main className='bg-background text-foreground dark'>
      <ErrorBoundary>
        <div>
          {/* <HuddleProvider client={huddleClient}> */}
          {/* <HuddleProvider client={huddleClient}> */}
          <ApolloProvider client={client}>
            <HeroUIProvider>
              <NextThemesProvider attribute='class' defaultTheme='dark'>
                <ThemeProvider
                  attribute='class'
                  defaultTheme='dark'
                  enableSystem
                  disableTransitionOnChange
                >
                  <TonConnectUIProvider
                    manifestUrl='https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/docs/tonconnect-manifest.json'
                    actionsConfiguration={{
                      twaReturnUrl: `https://t.me/${botName}/start`,
                    }}
                  >
                    {/* <Analytics />
                    <SpeedInsights /> */}
                    {!isDev && <BackgroundBeams />}
                    <HMSRoomProvider>
                      <Component {...pageProps} />

                      <ResizeHandler />
                      <Toaster />
                    </HMSRoomProvider>
                    {/* <BackgroundBeamsTwo /> */}
                  </TonConnectUIProvider>
                </ThemeProvider>
              </NextThemesProvider>
            </HeroUIProvider>
          </ApolloProvider>
          {/* </HuddleProvider> */}
        </div>
      </ErrorBoundary>
    </main>
  )
}
