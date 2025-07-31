import { DEV_AUTH_BYPASS } from "@/utils/constants";

// 🕉️ Dev Authentication Bypass: Skip validation in dev mode
if (!DEV_AUTH_BYPASS && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

import { corsHeaders } from "@/helpers/corsHeaders";
import {
  ApolloClient,
  createHttpLink,
  defaultDataIdFromObject,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ("nodeId" in responseObject) {
      return `${responseObject.nodeId}`;
    }

    return defaultDataIdFromObject(responseObject);
  },
  typePolicies: {
    Query: {
      fields: {
        // todosCollection: relayStylePagination(), // example of paginating a collection
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

const httpLink = createHttpLink({
  uri: DEV_AUTH_BYPASS 
    ? "http://localhost:80/api/mock-graphql" // Mock GraphQL endpoint for dev
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
});

const authLink = setContext(async (_, { headers }) => {
  //const token = (await supabase.auth.getSession()).data.session?.access_token;

  // 🕉️ Dev Authentication Bypass: Use mock headers
  if (DEV_AUTH_BYPASS) {
    console.log('🕉️ Apollo Client: Using dev bypass mode');
    return {
      headers: {
        ...corsHeaders,
        apiKey: "dev-bypass-key",
      },
    };
  }

  return {
    headers: {
      ...corsHeaders,
      apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dev-fallback",
    },
  };
});
// Authorization: token
//         ? `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
//         : "",
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: true,
});

declare global {
  interface Window {
    __APOLLO_CLIENT__: ApolloClient<any>; // Указание типа ApolloClient
  }
}

if (typeof window !== "undefined") {
  window.__APOLLO_CLIENT__ = apolloClient;
}

export default apolloClient;
