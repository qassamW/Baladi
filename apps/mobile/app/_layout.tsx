import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/theme";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function Layout() {
  return <SafeAreaProvider><StatusBar style="dark" /><Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.ink, headerTitleAlign: "center", contentStyle: { backgroundColor: colors.background } }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="report/new" options={{ title: "بلاغ جديد" }} />
    <Stack.Screen name="reports/index" options={{ title: "بلاغاتي" }} />
    <Stack.Screen name="reports/[id]" options={{ title: "تفاصيل البلاغ" }} />
    <Stack.Screen name="success" options={{ headerShown: false }} />
  </Stack></SafeAreaProvider>;
}
