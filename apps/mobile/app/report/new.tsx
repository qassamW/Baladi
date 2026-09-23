import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createReport } from "../../src/api";
import { AppText, Button, Icon, Message } from "../../src/components";
import { colors } from "../../src/theme";
import { categories, type Category } from "../../src/types";

type Photo = { uri: string; mimeType?: string; fileName?: string };
export default function NewReport() {
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [busyLocation, setBusyLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function pickPhoto(source: "camera" | "library") {
    setError("");
    try {
      const permission = source === "camera" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) { setError("يرجى السماح بالوصول إلى الكاميرا أو الصور من إعدادات الهاتف."); return; }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.65, allowsEditing: false };
      const result = source === "camera" ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const resized = await ImageManipulator.manipulateAsync(asset.uri, asset.width > 1600 ? [{ resize: { width: 1600 } }] : [], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });
        setPhoto({ uri: resized.uri, mimeType: "image/jpeg", fileName: "report.jpg" });
      }
    } catch { setError("تعذر اختيار الصورة. حاول مرة أخرى."); }
  }
  async function captureLocation() {
    setError(""); setBusyLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) { setError("يرجى السماح بالوصول إلى الموقع لتحديد مكان المشكلة."); return; }
      const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ latitude: result.coords.latitude, longitude: result.coords.longitude });
    } catch { setError("تعذر تحديد الموقع. تأكد من تفعيل خدمات الموقع وحاول مرة أخرى."); }
    finally { setBusyLocation(false); }
  }
  async function submit() {
    setError("");
    if (!category) { setError("اختر نوع المشكلة."); return; }
    if (!description.trim()) { setError("أضف وصفاً للمشكلة."); return; }
    if (!photo) { setError("أرفق صورة للمشكلة."); return; }
    if (!location) { setError("حدد موقع المشكلة."); return; }
    setSubmitting(true);
    try {
      const report = await createReport({ category, description: description.trim(), latitude: location.latitude, longitude: location.longitude, image: photo });
      router.replace({ pathname: "/success", params: { id: report.id, ticket: report.ticketNumber } });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "تعذر إرسال البلاغ. حاول مرة أخرى."); }
    finally { setSubmitting(false); }
  }
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <AppText style={styles.title}>بلّغ عن مشكلة</AppText><AppText style={styles.intro}>خطوات بسيطة تساعدنا في الوصول إلى المكان الصحيح.</AppText>
      <AppText style={styles.label}>نوع المشكلة <AppText style={styles.required}>*</AppText></AppText>
      <View style={styles.grid}>{categories.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: category === item.id }} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.selected]}>
        <MaterialCommunityIcons name={item.icon} size={25} color={category === item.id ? colors.primaryDark : colors.muted} /><AppText style={[styles.categoryText, category === item.id && { color: colors.primaryDark }]}>{item.label}</AppText>
      </Pressable>)}</View>
      <AppText style={styles.label}>وصف المشكلة <AppText style={styles.required}>*</AppText></AppText>
      <TextInput accessibilityLabel="وصف المشكلة" multiline maxLength={2000} textAlign="right" placeholder="صف لنا المشكلة..." placeholderTextColor="#8CA19D" value={description} onChangeText={setDescription} style={styles.input} />
      <AppText style={styles.label}>صورة المشكلة <AppText style={styles.required}>*</AppText></AppText>
      {photo ? <View style={styles.photoBox}><Image source={{ uri: photo.uri }} style={styles.preview} /><View style={styles.photoActions}><Button label="استبدال الصورة" secondary onPress={() => pickPhoto("library")} /><Pressable accessibilityRole="button" onPress={() => setPhoto(null)} style={styles.remove}><AppText style={{ color: colors.danger, fontWeight: "700" }}>إزالة الصورة</AppText></Pressable></View></View> : <View style={styles.options}><Button label="التقاط صورة" icon="camera-outline" secondary onPress={() => pickPhoto("camera")} /><Button label="اختيار من المعرض" icon="image-outline" secondary onPress={() => pickPhoto("library")} /></View>}
      <AppText style={styles.label}>موقع المشكلة <AppText style={styles.required}>*</AppText></AppText>
      <Button label={location ? "تحديث موقعي" : "استخدام موقعي الحالي"} icon="crosshairs-gps" secondary loading={busyLocation} onPress={captureLocation} />
      {location && <View style={styles.location}><Icon name="check-circle" color={colors.primary} /><View style={{ flex: 1 }}><AppText style={{ fontWeight: "700" }}>تم تحديد الموقع</AppText><AppText style={styles.coordinates}>{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</AppText></View></View>}
      {!!error && <Message text={error} error />}
      <Button label="إرسال البلاغ" icon="send-outline" loading={submitting} disabled={busyLocation} onPress={submit} />
    </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 42, gap: 13 },
  title: { fontSize: 27, fontWeight: "800", marginTop: 8 }, intro: { color: colors.muted, lineHeight: 23, marginBottom: 6 },
  label: { fontSize: 17, fontWeight: "700", marginTop: 12 }, required: { color: colors.danger }, grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  category: { width: "48.5%", minHeight: 80, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 16, padding: 12, alignItems: "flex-end", justifyContent: "center", gap: 5 },
  selected: { borderColor: colors.primary, backgroundColor: colors.soft }, categoryText: { fontSize: 13, fontWeight: "700" },
  input: { minHeight: 128, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, color: colors.ink, fontSize: 16, textAlignVertical: "top", writingDirection: "rtl" },
  options: { gap: 9 }, photoBox: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: "hidden" }, preview: { width: "100%", height: 190 }, photoActions: { padding: 10, gap: 4 },
  remove: { minHeight: 44, alignItems: "center", justifyContent: "center" }, location: { flexDirection: "row", alignItems: "center", gap: 9, padding: 13, backgroundColor: colors.soft, borderRadius: 14 },
  coordinates: { fontSize: 12, color: colors.muted, marginTop: 3, writingDirection: "ltr" }
});
