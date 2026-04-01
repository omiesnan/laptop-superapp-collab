import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CheckItemKey = 'screenDisplay' | 'keyboard' | 'battery' | 'diskHealth' | 'webcamMic' | 'speaker' | 'usbPorts';
type CheckDescKey = 'screenDisplayDesc' | 'keyboardDesc' | 'batteryDesc' | 'diskHealthDesc' | 'webcamMicDesc' | 'speakerDesc' | 'usbPortsDesc';
type CheckHowToKey = 'screenDisplayHowTo' | 'keyboardHowTo' | 'batteryHowTo' | 'diskHealthHowTo' | 'webcamMicHowTo' | 'speakerHowTo' | 'usbPortsHowTo';

interface CheckItem {
  id: string;
  titleKey: CheckItemKey;
  descKey: CheckDescKey;
  howToKey: CheckHowToKey;
  icon: 'monitor' | 'keyboard' | 'battery' | 'harddisk' | 'webcam' | 'volume-high' | 'usb';
  onlineToolUrl?: string;
}

const checkItems: CheckItem[] = [
  {
    id: 'screen',
    titleKey: 'screenDisplay',
    descKey: 'screenDisplayDesc',
    howToKey: 'screenDisplayHowTo',
    icon: 'monitor',
    onlineToolUrl: 'https://www.flatpanelshd.com/screen-test/',
  },
  {
    id: 'keyboard',
    titleKey: 'keyboard',
    descKey: 'keyboardDesc',
    howToKey: 'keyboardHowTo',
    icon: 'keyboard',
    onlineToolUrl: 'https://www.keyboardtester.com/',
  },
  {
    id: 'battery',
    titleKey: 'battery',
    descKey: 'batteryDesc',
    howToKey: 'batteryHowTo',
    icon: 'battery',
  },
  {
    id: 'disk',
    titleKey: 'diskHealth',
    descKey: 'diskHealthDesc',
    howToKey: 'diskHealthHowTo',
    icon: 'harddisk',
  },
  {
    id: 'webcam',
    titleKey: 'webcamMic',
    descKey: 'webcamMicDesc',
    howToKey: 'webcamMicHowTo',
    icon: 'webcam',
  },
  {
    id: 'speaker',
    titleKey: 'speaker',
    descKey: 'speakerDesc',
    howToKey: 'speakerHowTo',
    icon: 'volume-high',
  },
  {
    id: 'usb',
    titleKey: 'usbPorts',
    descKey: 'usbPortsDesc',
    howToKey: 'usbPortsHowTo',
    icon: 'usb',
  },
];

export default function CheckerScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const viewShotRef = useRef<ViewShot>(null);
  const [results, setResults] = useState<Record<string, boolean | null>>({
    screen: null,
    keyboard: null,
    battery: null,
    disk: null,
    webcam: null,
    speaker: null,
    usb: null,
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const setResult = (id: string, passed: boolean) => {
    setResults(prev => ({ ...prev, [id]: passed }));
  };

  const toggleExpanded = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openOnlineTool = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  const getOverallCondition = () => {
    const values = Object.values(results).filter(v => v !== null);
    if (values.length === 0) return null;
    const passCount = values.filter(v => v === true).length;
    const ratio = passCount / values.length;
    
    if (ratio === 1) return { label: t.excellent, color: COLORS.success };
    if (ratio >= 0.75) return { label: t.good, color: COLORS.primary };
    if (ratio >= 0.5) return { label: t.needsAttention, color: COLORS.warning };
    return { label: t.poor, color: COLORS.error };
  };

  const getResultsSummary = () => {
    const passed: string[] = [];
    const failed: string[] = [];
    const notTested: string[] = [];

    checkItems.forEach(item => {
      const result = results[item.id];
      const name = t[item.titleKey];
      if (result === true) passed.push(name);
      else if (result === false) failed.push(name);
      else notTested.push(name);
    });

    return { passed, failed, notTested };
  };

  const handleSaveImage = async () => {
    try {
      setIsSaving(true);
      
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow access to save images');
          setIsSaving(false);
          return;
        }
      }

      // Capture the view
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture?.();
        if (uri) {
          if (Platform.OS === 'web') {
            // For web, create download link
            const link = document.createElement('a');
            link.href = uri;
            link.download = `diagnosa-laptop-${Date.now()}.png`;
            link.click();
            Alert.alert(t.imageSaved);
          } else {
            // For mobile, save to gallery
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert(t.imageSaved);
          }
        }
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture?.();
        if (uri) {
          await Share.share({
            url: uri,
            message: t.exportWatermark,
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const overall = getOverallCondition();
  const summary = getResultsSummary();
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.checkerScreenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Illustration */}
        <View style={styles.illustration}>
          <MaterialCommunityIcons
            name="laptop"
            size={100}
            color={COLORS.primary}
          />
          <Text style={styles.illustrationText}>
            {t.checkerScreenTitle}
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.instructions}>{t.checkerInstructions}</Text>
        </View>

        {/* Checklist Items */}
        {checkItems.map(item => {
          const isExpanded = expandedItems[item.id];
          
          return (
            <View key={item.id} style={styles.checkItem}>
              {/* Header with Title and Info Button */}
              <View style={styles.checkItemHeader}>
                <View style={styles.checkItemInfo}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={COLORS.primary}
                  />
                  <View style={styles.checkItemText}>
                    <View style={styles.titleRow}>
                      <Text style={styles.checkItemTitle}>{t[item.titleKey]}</Text>
                      <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => toggleExpanded(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <MaterialCommunityIcons
                          name={isExpanded ? 'chevron-up-circle' : 'help-circle-outline'}
                          size={22}
                          color={isExpanded ? COLORS.primary : COLORS.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.checkItemDesc}>{t[item.descKey]}</Text>
                  </View>
                </View>
              </View>

              {/* Expandable How-To Section */}
              {isExpanded && (
                <View style={styles.howToContainer}>
                  <View style={styles.howToHeader}>
                    <MaterialCommunityIcons
                      name="lightbulb-on-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.howToTitle}>{t.howToCheck}</Text>
                  </View>
                  <Text style={styles.howToText}>{t[item.howToKey]}</Text>
                  
                  {/* Online Tool Button */}
                  {item.onlineToolUrl && (
                    <TouchableOpacity
                      style={styles.onlineToolButton}
                      onPress={() => openOnlineTool(item.onlineToolUrl!)}
                    >
                      <MaterialCommunityIcons
                        name="open-in-new"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.onlineToolText}>{t.openOnlineTool}</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.hideButton}
                    onPress={() => toggleExpanded(item.id)}
                  >
                    <Text style={styles.hideButtonText}>{t.hideHowTo}</Text>
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={16}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* Cara Cek Button (when not expanded) */}
              {!isExpanded && (
                <View style={styles.caraCheckRow}>
                  <TouchableOpacity
                    style={styles.caraCheckButton}
                    onPress={() => toggleExpanded(item.id)}
                  >
                    <MaterialCommunityIcons
                      name="help-circle-outline"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={styles.caraCheckText}>{t.howToCheck}</Text>
                  </TouchableOpacity>
                  
                  {item.onlineToolUrl && (
                    <TouchableOpacity
                      style={styles.quickToolButton}
                      onPress={() => openOnlineTool(item.onlineToolUrl!)}
                    >
                      <MaterialCommunityIcons
                        name="open-in-new"
                        size={14}
                        color={COLORS.info}
                      />
                      <Text style={styles.quickToolText}>{t.openOnlineTool}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Pass/Fail Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    styles.passButton,
                    results[item.id] === true && styles.passButtonActive,
                  ]}
                  onPress={() => setResult(item.id, true)}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={results[item.id] === true ? COLORS.background : COLORS.success}
                  />
                  <Text
                    style={[
                      styles.resultButtonText,
                      results[item.id] === true && styles.resultButtonTextActive,
                    ]}
                  >
                    {t.pass}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    styles.failButton,
                    results[item.id] === false && styles.failButtonActive,
                  ]}
                  onPress={() => setResult(item.id, false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={results[item.id] === false ? COLORS.background : COLORS.error}
                  />
                  <Text
                    style={[
                      styles.resultButtonText,
                      styles.failButtonText,
                      results[item.id] === false && styles.resultButtonTextActive,
                    ]}
                  >
                    {t.fail}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Overall Condition */}
        <View style={styles.overallCard}>
          <Text style={styles.overallTitle}>{t.overallCondition}</Text>
          {overall ? (
            <View style={[styles.overallBadge, { backgroundColor: overall.color }]}>
              <Text style={styles.overallBadgeText}>{overall.label}</Text>
            </View>
          ) : (
            <Text style={styles.overallPlaceholder}>-</Text>
          )}
        </View>

        {/* Save/Export Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowExportModal(true)}
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={24}
            color={COLORS.background}
          />
          <Text style={styles.saveButtonText}>{t.saveResult}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 0.9 }}
                style={styles.exportCard}
              >
                {/* Export Header */}
                <View style={styles.exportHeader}>
                  <MaterialCommunityIcons
                    name="laptop"
                    size={40}
                    color={COLORS.primary}
                  />
                  <Text style={styles.exportTitle}>{t.exportTitle}</Text>
                  <Text style={styles.exportDate}>{currentDate}</Text>
                </View>

                {/* Overall Badge */}
                {overall && (
                  <View style={[styles.exportOverallBadge, { backgroundColor: overall.color }]}>
                    <Text style={styles.exportOverallText}>
                      {t.exportSummary}: {overall.label}
                    </Text>
                  </View>
                )}

                {/* Passed Items */}
                {summary.passed.length > 0 && (
                  <View style={styles.exportSection}>
                    <View style={styles.exportSectionHeader}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={COLORS.success}
                      />
                      <Text style={[styles.exportSectionTitle, { color: COLORS.success }]}>
                        {t.exportPassedItems} ({summary.passed.length})
                      </Text>
                    </View>
                    {summary.passed.map((item, index) => (
                      <Text key={index} style={styles.exportItem}>• {item}</Text>
                    ))}
                  </View>
                )}

                {/* Failed Items */}
                {summary.failed.length > 0 && (
                  <View style={styles.exportSection}>
                    <View style={styles.exportSectionHeader}>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color={COLORS.error}
                      />
                      <Text style={[styles.exportSectionTitle, { color: COLORS.error }]}>
                        {t.exportFailedItems} ({summary.failed.length})
                      </Text>
                    </View>
                    {summary.failed.map((item, index) => (
                      <Text key={index} style={styles.exportItem}>• {item}</Text>
                    ))}
                  </View>
                )}

                {/* Not Tested Items */}
                {summary.notTested.length > 0 && (
                  <View style={styles.exportSection}>
                    <View style={styles.exportSectionHeader}>
                      <MaterialCommunityIcons
                        name="help-circle"
                        size={20}
                        color={COLORS.textMuted}
                      />
                      <Text style={[styles.exportSectionTitle, { color: COLORS.textMuted }]}>
                        {t.exportNotTested} ({summary.notTested.length})
                      </Text>
                    </View>
                    {summary.notTested.map((item, index) => (
                      <Text key={index} style={[styles.exportItem, { color: COLORS.textMuted }]}>• {item}</Text>
                    ))}
                  </View>
                )}

                {/* Watermark */}
                <View style={styles.watermarkContainer}>
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.watermarkText}>{t.exportWatermark}</Text>
                </View>
              </ViewShot>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.shareButton]}
                  onPress={handleShare}
                  disabled={isSaving}
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.shareButtonText}>{t.shareResult}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.downloadButton]}
                  onPress={handleSaveImage}
                  disabled={isSaving}
                >
                  <MaterialCommunityIcons
                    name="download"
                    size={20}
                    color={COLORS.background}
                  />
                  <Text style={styles.downloadButtonText}>
                    {isSaving ? t.savingImage : t.saveResult}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.closeButtonText}>{t.closeExport}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  illustration: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  illustrationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.md,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  instructions: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  checkItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  checkItemHeader: {
    marginBottom: SPACING.sm,
  },
  checkItemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkItemText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  checkItemTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  infoButton: {
    padding: SPACING.xs,
  },
  checkItemDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  howToContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  howToHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  howToTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  howToText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  onlineToolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  onlineToolText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  hideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    gap: SPACING.xs,
  },
  hideButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  caraCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  caraCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  caraCheckText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quickToolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
  },
  quickToolText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.info,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 2,
  },
  passButton: {
    borderColor: COLORS.success,
    backgroundColor: 'transparent',
  },
  passButtonActive: {
    backgroundColor: COLORS.success,
  },
  failButton: {
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  failButtonActive: {
    backgroundColor: COLORS.error,
  },
  resultButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  failButtonText: {
    color: COLORS.error,
  },
  resultButtonTextActive: {
    color: COLORS.background,
  },
  overallCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  overallTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  overallBadge: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  overallBadgeText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
  },
  overallPlaceholder: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.textMuted,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  exportCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  exportHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  exportTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  exportDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  exportOverallBadge: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  exportOverallText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  exportSection: {
    marginBottom: SPACING.md,
  },
  exportSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  exportSectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  exportItem: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  watermarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    gap: SPACING.sm,
  },
  watermarkText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  downloadButtonText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  closeButtonText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
  },
});
