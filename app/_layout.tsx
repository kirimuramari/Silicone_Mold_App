import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#8B5CF6",
    background: "#fff",
    surface: "#1E1E1E",
    onSurface: "#333333",
  },
  roundness: 20,
};
export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("white");
  }, []);
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </PaperProvider>
  );
}
