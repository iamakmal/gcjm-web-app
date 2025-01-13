// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FirebaseProvider } from "@/contexts/firebaseContext"; // Import the FirebaseProvider

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider> {/* Wrap the app with FirebaseProvider */}
        <Component {...pageProps} />
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
