import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import {msalConfig} from './auth-config'

// MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated
// on re-renders.
const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// listen for sign-in
msalInstance.addEventCallback((event) => {
  if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload.account
  ) {
      msalInstance.setActiveAccount(event.payload.account);
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App instance={msalInstance}/>
    </React.StrictMode>
  </BrowserRouter>
);

export { msalInstance };