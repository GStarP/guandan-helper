import React from 'react'
import ReactDOM from 'react-dom/client'

import '@/infra/ag-grid'

import App from './App.tsx'
import './index.css'
import MyThemeProvider from './infra/theme/MyThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MyThemeProvider>
      <App />
    </MyThemeProvider>
  </React.StrictMode>,
)
