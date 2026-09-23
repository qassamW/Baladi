import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReports } from "../../src/api";
import { AppText, Button, Icon, Message, StatusBadge } from "../../src/components";
import { colors } from "../../src/theme";
import { categoryLabel, type Report } from "../../src/types";

const date = (value: string) => new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try { setReports(await getReports()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغات."); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}>
    <AppText style={styles.title}>بلاغاتي</AppText><AppText style={styles.subtitle}>تابع حالة البلاغات وآخر المستجدات.</AppText>
    {loading ? <View style={styles.center}><ActivityIndicator color={colors.primary} /><AppText style={styles.muted}>جارٍ تحميل البلاغات...</AppText></View> : error ? <View style={styles.center}><Message text={error} error /><Button label="إعادة المحاولة" secondary onPress={() => void load()} /></View> : reports.length === 0 ? <View style={styles.center}><Icon name="clipboard-text-outline" size={54} color={colors.muted} /><AppText style={styles.emptyTitle}>لا توجد بلاغات بعد</AppText><AppText style={styles.muted}>ابدأ ببلاغك الأول وساعد في تحسين مدينتك.</AppText><Button label="بلّغ عن مشكلة" onPress={() => router.push("/report/new")} /></View> : reports.map(report => <Pressable key={report.id} accessibilityRole="button" accessibilityLabel={`بلاغ ${report.ticketNumber}، ${categoryLabel(report.category)}`} onPress={() => router.push({ pathname: "/reports/[id]", params: { id: report.id } })} style={styles.card}>
      <View style={styles.cardTop}><AppText style={styles.ticket}>{report.ticketNumber}</AppText><StatusBadge status={report.status} /></View>
      <AppText style={styles.category}>{categoryLabel(report.category)}</AppText><AppText numberOfLines={2} style={styles.description}>{report.description}</AppText>
      <View style={styles.cardBottom}><AppText style={styles.date}>{date(report.createdAt)}</AppText><Icon name="arrow-left" size={18} color={colors.primary} /></View>
    </Pressable>)}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 36, gap: 12, flexGrow: 1 }, title: { fontSize: 28, fontWeight: "800", marginTop: 8 }, subtitle: { color: colors.muted, marginBottom: 8 }, center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 13, minHeight: 280 }, muted: { color: colors.muted, textAlign: "center" }, emptyTitle: { fontSize: 20, fontWeight: "800" }, card: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 17, gap: 9 }, cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, ticket: { color: colors.primary, fontWeight: "800", writingDirection: "ltr" }, category: { fontSize: 18, fontWeight: "800" }, description: { color: colors.muted, lineHeight: 22 }, cardBottom: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, date: { color: colors.muted, fontSize: 12 } });
