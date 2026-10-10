import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Load order matters: tokens define the custom properties every later layer
   reads, fonts must be declared before any type rules, and utilities come last
   so they can override the base layer. */
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/global.css';
import './styles/typography.css';
import './styles/utilities.css';

import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
