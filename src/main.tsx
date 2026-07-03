import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import deDE from 'antd/locale/de_DE'
import './index.css'
import App from './App.tsx'
import theme from './designsystem/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme} locale={deDE}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
