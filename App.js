import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/store";
import "./src/translations/i18n";
import Router from "./src/router";
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

export default App;
