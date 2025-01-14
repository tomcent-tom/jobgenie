import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider} from 'posthog-js/react'

const posthogKey = import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST;

const options = {
  api_host: posthogHost,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider 
      apiKey={posthogKey}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)
