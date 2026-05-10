import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import axios from 'axios'

// Configure Axios default base URL to use the deployed backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://medikart-1bgh.vercel.app';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
