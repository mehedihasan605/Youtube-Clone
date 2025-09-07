
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { LayoutProvider } from './hooks/context/LayoutProvider.jsx';
import { ThemeProvider } from './hooks/context/ThemeProvider.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <App />
        </LayoutProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
)
