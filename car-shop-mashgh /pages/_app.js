import Layput from "@/layout/layput";
import "@/styles/globals.css";
import { DataProvider } from "@/context/data";
export default function App({ Component, pageProps }) {
  return (
    <DataProvider>
    <Layput>
      <Component {...pageProps} />
    </Layput>
    </DataProvider>
  );
}
