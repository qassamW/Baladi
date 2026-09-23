import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, Button, Icon } from "../src/components";
import { colors } from "../src/theme";

export default function Home() {
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <View style={styles.brand}><View style={styles.mark}><Icon name="city-variant-outline" size={28} color="white" /></View><View><AppText style={styles.brandArabic}>بلدي</AppText><AppText style={styles.brandLatin}>BALADI</AppText></View></View>
    <View style={styles.hero}><View style={styles.orb}><Icon name="map-marker-check-outline" size={62} color={colors.primary} /></View><AppText style={styles.eyebrow}>معاً لمدينة أفضل</AppText><AppText style={styles.title}>مدينتك أفضل بمشاركتك</AppText><AppText style={styles.description}>بلّغ عن مشكلات المرافق العامة وتابع ما يحدث لبلاغك خطوة بخطوة.</AppText></View>
    <View style={styles.actions}><Button label="بلّغ عن مشكلة" icon="plus-circle-outline" onPress={() => router.push("/report/new")} /><Button label="بلاغاتي" icon="clipboard-text-outline" secondary onPress={() => router.push("/reports")} /></View>
    <View style={styles.note}><Icon name="shield-check-outline" size={22} /><AppText style={styles.noteText}>بلاغك يصل إلى البلدية ويساعد في تحسين الحي.</AppText></View>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 22, paddingBottom: 32 },
  brand: { flexDirection: "row", alignItems: "center", gap: 11 }, mark: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  brandArabic: { fontSize: 23, fontWeight: "800", lineHeight: 29 }, brandLatin: { fontSize: 10, letterSpacing: 2.5, color: colors.muted, textAlign: "right" },
  hero: { flex: 1, minHeight: 380, alignItems: "flex-end", justifyContent: "center", paddingVertical: 32 },
  orb: { width: 136, height: 136, borderRadius: 68, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center", marginBottom: 27, borderWidth: 1, borderColor: "#CDE7DD" },
  eyebrow: { color: colors.primary, fontSize: 15, fontWeight: "700", marginBottom: 10 }, title: { fontSize: 36, lineHeight: 48, fontWeight: "800", maxWidth: 310 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 27, marginTop: 16, maxWidth: 320 }, actions: { gap: 12 },
  note: { flexDirection: "row", alignItems: "center", gap: 9, paddingTop: 25 }, noteText: { flex: 1, color: colors.muted, fontSize: 13, lineHeight: 21 }
});
