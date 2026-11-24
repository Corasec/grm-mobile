import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login/Login";

const Stack = createStackNavigator();
const defaultHeaderOptions = {
  title: "",
  headerShown: false,
};

// Accounts and passwords are created by the GRM administrator and given to each
// committee / facilitator: the app only needs a login screen (no sign-up, no code).
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} options={defaultHeaderOptions} />
    </Stack.Navigator>
  );
};

export default AuthStack;
