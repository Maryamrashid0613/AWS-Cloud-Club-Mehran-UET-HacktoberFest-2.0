import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { ContextProvider } from './components/ContextApi.jsx'
import 'react-toastify/ReactToastify.css'; 



createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      <ContextProvider>
      <App />
      </ContextProvider>
    </AuthProvider>

)
