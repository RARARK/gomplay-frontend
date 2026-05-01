const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import Component1 from "./screens/Component1";
import Component from "./screens/Component";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          {hideSplashScreen ? (
            <Stack.Navigator
              initialRouteName="Alert"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                name="Alert"
                component={Component1}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CardDetails"
                component={Component}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          ) : null}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};
export default App;
