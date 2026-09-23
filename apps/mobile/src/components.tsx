import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";
import { statusInfo, type Status } from "./types";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
export function Icon({ name, size = 22, color = colors.primary }: { name: IconName; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
export function AppText({ children, style, numberOfLines }: { children: ReactNode; style?: object; numberOfLines?: number }) {
  return <Text numberOfLines={numberOfLines} style={[styles.text, style]}>{children}</Text>;
}
export function Button({ label, onPress, icon, secondary, disabled, loading }: { label: string; onPress: () => void; icon?: IconName; secondary?: boolean; disabled?: boolean; loading?: boolean }) {
  const tint = secondary ? colors.primary : "#FFFFFF";
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, (disabled || loading) && styles.disabled, pressed && styles.pressed]}>
    {loading ? <ActivityIndicator color={tint} /> : icon ? <Icon name={icon} size={20} color={tint} /> : null}
    <AppText style={[styles.buttonText, secondary && { color: colors.primary }]}>{label}</AppText>
  </Pressable>;
}
export function StatusBadge({ status }: { status: Status }) {
  const item = statusInfo(status);
  return <View style={[styles.badge, { backgroundColor: item.background }]}><AppText style={{ color: item.color, fontSize: 12, fontWeight: "700" }}>{item.label}</AppText></View>;
}
export function Message({ text, error = false }: { text: string; error?: boolean }) {
  return <View style={[styles.message, error && { backgroundColor: "#FCEDEA" }]}><Icon name={error ? "alert-circle-outline" : "information-outline"} size={20} color={error ? colors.danger : colors.primary} /><AppText style={{ color: error ? colors.danger : colors.ink, flex: 1 }}>{text}</AppText></View>;
}
const styles = StyleSheet.create({
  text: { color: colors.ink, fontSize: 15, textAlign: "right", writingDirection: "rtl" },
  button: { minHeight: 54, paddingHorizontal: 20, borderRadius: 16, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  secondary: { backgroundColor: colors.soft, borderWidth: 1, borderColor: "#C9E6DC" },
  disabled: { opacity: 0.55 }, pressed: { opacity: 0.8 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  badge: { alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  message: { backgroundColor: colors.soft, borderRadius: 14, padding: 13, flexDirection: "row", alignItems: "center", gap: 9 }
});
