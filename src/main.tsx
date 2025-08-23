import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './hooks/use-theme.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="alba-shoes-theme">
          <App />
        </ThemeProvider>
        <Toaster />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
