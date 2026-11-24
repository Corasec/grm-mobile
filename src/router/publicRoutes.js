import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "../screens/Auth";

const Stack = createStackNavigator();

// The app opens directly on the login screen.
const PublicRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="AuthStack" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
