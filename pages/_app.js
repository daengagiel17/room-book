import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import '../styles/globals.css'; // Import global CSS file here

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
