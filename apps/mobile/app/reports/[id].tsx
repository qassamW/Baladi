import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReport, imageUrl } from "../../src/api";
import { AppText, Button, Icon, Message, StatusBadge } from "../../src/components";
import { colors } from "../../src/theme";
import { categoryLabel, statuses, type Report } from "../../src/types";

const date = (value: string) => new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
export default function ReportDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async (refresh = false) => {
    if (!id) return;
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try { setReport(await getReport(id)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغ."); }
    finally { setLoading(false); setRefreshing(false); }
  }, [id]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const currentStep = statuses.findIndex(item => item.id === report?.status);
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}>
    {loading ? <View style={styles.center}><ActivityIndicator color={colors.primary} /><AppText>جارٍ تحميل البلاغ...</AppText></View> : error ? <View style={styles.center}><Message text={error} error /><Button label="إعادة المحاولة" secondary onPress={() => void load()} /></View> : report && <>
      <View style={styles.header}><AppText style={styles.ticket}>{report.ticketNumber}</AppText><StatusBadge status={report.status} /></View>
      <AppText style={styles.title}>{categoryLabel(report.category)}</AppText><AppText style={styles.muted}>قُدّم في {date(report.createdAt)}</AppText>
      <View style={styles.card}><AppText style={styles.sectionTitle}>تفاصيل المشكلة</AppText><AppText style={styles.body}>{report.description}</AppText>{imageUrl(report.imageUrl) ? <Image source={{ uri: imageUrl(report.imageUrl)! }} style={styles.photo} resizeMode="cover" /> : <View style={styles.noPhoto}><Icon name="image-off-outline" color={colors.muted} /><AppText style={styles.muted}>لا توجد صورة مرفقة</AppText></View>}</View>
      <View style={styles.card}><AppText style={styles.sectionTitle}>الموقع</AppText>{report.address && <AppText style={styles.body}>{report.address}</AppText>}<View style={styles.location}><Icon name="map-marker-outline" /><AppText style={styles.coords}>{report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</AppText></View></View>
      {report.department && <View style={styles.card}><AppText style={styles.sectionTitle}>القسم المسؤول</AppText><AppText style={styles.body}>{report.department}</AppText></View>}
      {report.adminNote && <View style={styles.card}><AppText style={styles.sectionTitle}>ملاحظة البلدية</AppText><AppText style={styles.body}>{report.adminNote}</AppText></View>}
      <View style={styles.card}><AppText style={styles.sectionTitle}>حالة البلاغ</AppText>{statuses.map((item, index) => <View key={item.id} style={styles.step}><View style={[styles.dot, index <= currentStep && styles.activeDot]}>{index <= currentStep && <Icon name="check" size={13} color="white" />}</View><AppText style={[styles.stepText, index === currentStep && { fontWeight: "800", color: colors.primaryDark }]}>{item.step}</AppText></View>)}</View>
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 40, gap: 12, flexGrow: 1 }, center: { minHeight: 300, flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }, ticket: { color: colors.primary, fontWeight: "800", fontSize: 17, writingDirection: "ltr" }, title: { fontSize: 28, fontWeight: "800" }, muted: { color: colors.muted, fontSize: 13 }, card: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 17, gap: 11 }, sectionTitle: { fontSize: 17, fontWeight: "800" }, body: { lineHeight: 25 }, photo: { width: "100%", height: 220, borderRadius: 12 }, noPhoto: { minHeight: 95, backgroundColor: colors.background, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, location: { flexDirection: "row", alignItems: "center", gap: 7 }, coords: { color: colors.muted, writingDirection: "ltr" }, step: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 39 }, dot: { width: 25, height: 25, borderRadius: 13, borderWidth: 2, borderColor: colors.line, alignItems: "center", justifyContent: "center" }, activeDot: { backgroundColor: colors.primary, borderColor: colors.primary }, stepText: { color: colors.muted } });
