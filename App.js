import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/store";
import "./src/translations/i18n";
import Router from "./src/router";
import * as Sentry from '@sentry/react-native';
import { configureLearningMaterialsApi } from 'grm-learning-materials';
import config from './config';
import { getSessionData } from './src/store/ducks/authentication.duck';

configureLearningMaterialsApi({
  baseURL: config.API_AUTH_BASE_URL,
  getAuthHeaders: async () => {
    const session = await getSessionData();
    if (!session || !session.token) return {};
    return { Authorization: `Token ${session.token}` };
  },
});

Sentry.init({
  dsn: 'https://13d0e5a2fdf6ca1d5f320c6dd4e0657b@o4511032262066176.ingest.us.sentry.io/4511032273797120',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  // integrations: [Sentry.mobileReplayIntegration()],
  integrations: [],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});


if (__DEV__) {
  // eslint-disable-next-line no-console
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

const App = () =>
{
  return (
      <ReduxProvider store={store}>
          <PaperProvider>
            <Router />
          </PaperProvider>
      </ReduxProvider>
  );
};

export default Sentry.wrap(App);