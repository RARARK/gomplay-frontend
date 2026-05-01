const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Component from "./screens/Component";
import Component1 from "./screens/Component1";
import Component2 from "./screens/Component2";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({ "": require("./assets/fonts/.otf") });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          {hideSplashScreen ? (
            <Stack.Navigator
              initialRouteName="Component"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                name="Component"
                component={Component}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Component1"
                component={Component1}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Component2"
                component={Component2}
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
