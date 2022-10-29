import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme';
import { FirebaseProvider } from '../firebase';
import { FIREBASE_CONFIG } from '../utils/c';

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseProvider firebaseConfig={FIREBASE_CONFIG}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </FirebaseProvider>
  )
  return <Component {...pageProps} />
}

export default MyApp
