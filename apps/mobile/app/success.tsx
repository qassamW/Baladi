import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, Button, Icon } from "../src/components";
import { colors } from "../src/theme";

export default function Success() {
  const { id, ticket } = useLocalSearchParams<{ id: string; ticket: string }>();
  return <SafeAreaView style={styles.container}><View style={styles.center}>
    <View style={styles.circle}><Icon name="check" size={55} color={colors.primary} /></View>
    <AppText style={styles.title}>تم استلام بلاغك بنجاح</AppText>
    <AppText style={styles.message}>شكراً لمشاركتك في تحسين مدينتك. يمكنك متابعة البلاغ من التطبيق.</AppText>
    <View style={styles.ticket}><AppText style={styles.ticketLabel}>رقم البلاغ</AppText><AppText style={styles.ticketNumber}>{ticket || "—"}</AppText></View>
  </View><View style={styles.actions}><Button label="متابعة البلاغ" onPress={() => router.replace({ pathname: "/reports/[id]", params: { id } })} /><Button label="العودة للرئيسية" secondary onPress={() => router.replace("/")} /></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background, padding: 24 }, center: { flex: 1, justifyContent: "center", alignItems: "center" }, circle: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center", marginBottom: 28 }, title: { fontSize: 26, fontWeight: "800", textAlign: "center" }, message: { color: colors.muted, textAlign: "center", lineHeight: 25, marginTop: 13 }, ticket: { alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 22, borderRadius: 18, alignSelf: "stretch", marginTop: 32 }, ticketLabel: { color: colors.muted }, ticketNumber: { fontSize: 27, fontWeight: "800", color: colors.primary, marginTop: 7, writingDirection: "ltr" }, actions: { gap: 11, paddingBottom: 12 } });
