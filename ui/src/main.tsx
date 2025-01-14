/* eslint-disable import/first */
// if (import.meta.env.VITE_ENABLE_WDYR) {
//   import.meta.glob('./wdyr.ts', { eager: true });
// }

/* eslint-disable */
import { EditorView } from '@tiptap/pm/view';

const oldUpdateState = EditorView.prototype.updateState;

EditorView.prototype.updateState = function updateState(state) {
  if (!(this as any).docView) {
    //return; // This prevents the matchesNode error on hot reloads
  }
  // (this as any).updateStateInner(state, this.state.plugins != state.plugins); //eslint-disable-line
  oldUpdateState.call(this, state);
};

import React from 'react';
import { PostHogProvider } from 'posthog-js/react';
import App from './app';
import _api from './api';

import './styles/index.css';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import queryClient from './queryClient';
import indexedDBPersistor from './indexedDBPersistor';
import { analyticsClient, captureError } from './logic/analytics';
import { createRoot } from 'react-dom/client';
import SafeAreaProvider from './logic/SafeAreaContext';

const IS_MOCK =
  import.meta.env.MODE === 'mock' || import.meta.env.MODE === 'staging';

if (IS_MOCK) {
  window.ship = 'finned-palmer';
  window.our = '~finned-palmer';
}

window.our = `~${window.ship}`;

window.addEventListener('error', (e) => {
  captureError('window', e.error);
});

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: indexedDBPersistor(`${window.our}-landscape`),
        buster: `${window.our}-landscape-4.0.1`,
      }}
    >
      <SafeAreaProvider>
        <PostHogProvider client={analyticsClient}>
          <App />
        </PostHogProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
