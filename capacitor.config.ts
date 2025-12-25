import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.codgoo.ecosystem',
  appName: 'Codgoo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
