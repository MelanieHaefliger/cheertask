// pages/_app.js

// 1) global “framework” styles
import './styles/globals.css'

// 2) your CheerTask overrides
import './styles/cheertask.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
