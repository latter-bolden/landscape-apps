import {
  AppDataContextProvider,
  AudioPlayerProvider,
  config,
} from '@tloncorp/app/ui';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import { usePageStore } from './data/pageStore';
import { useSystemTheme } from './data/systemTheme';
import { ProfileRouter } from './router';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(<AppWrapper />);

function AppWrapper() {
  const theme = useSystemTheme();
  const { contact } = usePageStore();

  useEffect(() => {
    console.log('got contact', contact);
  }, [contact]);

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <AppDataContextProvider contacts={[contact]}>
          <AudioPlayerProvider>
            <ProfileRouter />
          </AudioPlayerProvider>
        </AppDataContextProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
