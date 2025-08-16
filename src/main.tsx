import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
