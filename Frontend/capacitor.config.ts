import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miracle.app',
  appName: 'Miracle',
  webDir: 'dist/Frontend/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;