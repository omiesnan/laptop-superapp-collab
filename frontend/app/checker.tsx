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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CheckItemKey = 'screenDisplay' | 'keyboard' | 'battery' | 'diskHealth' | 'webcamMic' | 'speaker' | 'usbPorts' | 'touchpad' | 'hingeBody' | 'chargerPort';
type CheckDescKey = 'screenDisplayDesc' | 'keyboardDesc' | 'batteryDesc' | 'diskHealthDesc' | 'webcamMicDesc' | 'speakerDesc' | 'usbPortsDesc' | 'touchpadDesc' | 'hingeBodyDesc' | 'chargerPortDesc';
type CheckHowToKey = 'screenDisplayHowTo' | 'keyboardHowTo' | 'batteryHowTo' | 'diskHealthHowTo' | 'webcamMicHowTo' | 'speakerHowTo' | 'usbPortsHowTo' | 'touchpadHowTo' | 'hingeBodyHowTo' | 'chargerPortHowTo';

interface CheckItem {
  id: string;
  titleKey: CheckItemKey;
  descKey: CheckDescKey;
  howToKey: CheckHowToKey;
  icon: 'monitor' | 'keyboard' | 'battery' | 'harddisk' | 'webcam' | 'volume-high' | 'usb' | 'gesture-tap' | 'laptop' | 'power-plug';
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
    id: 'touchpad',
    titleKey: 'touchpad',
    descKey: 'touchpadDesc',
    howToKey: 'touchpadHowTo',
    icon: 'gesture-tap',
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
  {
    id: 'hinge',
    titleKey: 'hingeBody',
    descKey: 'hingeBodyDesc',
    howToKey: 'hingeBodyHowTo',
    icon: 'laptop',
  },
  {
    id: 'charger',
    titleKey: 'chargerPort',
    descKey: 'chargerPortDesc',
    howToKey: 'chargerPortHowTo',
    icon: 'power-plug',
  },
];

export default function CheckerScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const viewShotRef = useRef<ViewShot>(null);
  
  const initialResults: Record<string, boolean | null> = {};
  const initialNotes: Record<string, string> = {};
  checkItems.forEach(item => {
    initialResults[item.id] = null;
    initialNotes[item.id] = '';
  });
  
  const [results, setResults] = useState<Record<string, boolean | null>>(initialResults);
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const setResult = (id: string, passed: boolean) => {
    setResults(prev => ({ ...prev, [id]: passed }));
  };

  const setNote = (id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }));
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
    
    if (ratio === 1) return { label: t.excellent, color: COLORS.success, colorHex: '#4CAF50' };
    if (ratio >= 0.75) return { label: t.good, color: COLORS.primary, colorHex: '#00BFA6' };
    if (ratio >= 0.5) return { label: t.needsAttention, color: COLORS.warning, colorHex: '#FFC107' };
    return { label: t.poor, color: COLORS.error, colorHex: '#F44336' };
  };

  const getResultsSummary = () => {
    const passed: { name: string; note: string }[] = [];
    const failed: { name: string; note: string }[] = [];
    const notTested: { name: string }[] = [];

    checkItems.forEach(item => {
      const result = results[item.id];
      const name = t[item.titleKey];
      const note = notes[item.id];
      if (result === true) passed.push({ name, note });
      else if (result === false) failed.push({ name, note });
      else notTested.push({ name });
    });

    return { passed, failed, notTested };
  };

  const currentDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const generatePdfHtml = () => {
    const overall = getOverallCondition();
    const summary = getResultsSummary();

    const passedHtml = summary.passed.map(item => `
      <div class="item passed">
        <span class="icon">✓</span>
        <span class="name">${item.name}</span>
        ${item.note ? `<span class="note">${item.note}</span>` : ''}
      </div>
    `).join('');

    const failedHtml = summary.failed.map(item => `
      <div class="item failed">
        <span class="icon">✗</span>
        <span class="name">${item.name}</span>
        ${item.note ? `<span class="note">${item.note}</span>` : ''}
      </div>
    `).join('');

    const notTestedHtml = summary.notTested.map(item => `
      <div class="item not-tested">
        <span class="icon">-</span>
        <span class="name">${item.name}</span>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${t.exportCertTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .certificate {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-bottom: 4px solid #00BFA6;
          }
          .header h1 {
            font-size: 20px;
            color: #00BFA6;
            margin-bottom: 8px;
            letter-spacing: 2px;
          }
          .header .app-name {
            font-size: 14px;
            color: #B0B0B0;
            margin-bottom: 16px;
          }
          .header .date {
            font-size: 13px;
            color: #707070;
          }
          .overall {
            padding: 20px 30px;
            text-align: center;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
          }
          .overall-badge {
            display: inline-block;
            padding: 12px 32px;
            border-radius: 50px;
            color: white;
            font-weight: bold;
            font-size: 16px;
          }
          .overall-label {
            display: block;
            margin-top: 8px;
            color: #666;
            font-size: 12px;
          }
          .content {
            padding: 24px 30px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #eee;
          }
          .section-title.passed { color: #4CAF50; border-color: #4CAF50; }
          .section-title.failed { color: #F44336; border-color: #F44336; }
          .section-title.not-tested { color: #999; border-color: #ddd; }
          .item {
            display: flex;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .item:last-child { border-bottom: none; }
          .item .icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 14px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .item.passed .icon { background: #E8F5E9; color: #4CAF50; }
          .item.failed .icon { background: #FFEBEE; color: #F44336; }
          .item.not-tested .icon { background: #f5f5f5; color: #999; }
          .item .name {
            font-size: 14px;
            color: #333;
            flex: 1;
          }
          .item .note {
            display: block;
            font-size: 12px;
            color: #666;
            font-style: italic;
            margin-top: 4px;
            padding-left: 36px;
            width: 100%;
          }
          .footer {
            background: #0D0D0D;
            color: #00BFA6;
            padding: 16px 30px;
            text-align: center;
            font-size: 11px;
          }
          .footer .wa {
            color: #25D366;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1>${t.exportCertTitle}</h1>
            <div class="app-name">Superapp Panduan Laptop</div>
            <div class="date">${t.exportDate}: ${currentDate}</div>
          </div>
          
          ${overall ? `
          <div class="overall">
            <div class="overall-badge" style="background-color: ${overall.colorHex}">
              ${overall.label}
            </div>
            <span class="overall-label">${t.exportSummary}</span>
          </div>
          ` : ''}
          
          <div class="content">
            ${summary.passed.length > 0 ? `
            <div class="section">
              <div class="section-title passed">${t.exportPassedItems} (${summary.passed.length})</div>
              ${passedHtml}
            </div>
            ` : ''}
            
            ${summary.failed.length > 0 ? `
            <div class="section">
              <div class="section-title failed">${t.exportFailedItems} (${summary.failed.length})</div>
              ${failedHtml}
            </div>
            ` : ''}
            
            ${summary.notTested.length > 0 ? `
            <div class="section">
              <div class="section-title not-tested">${t.exportNotTested} (${summary.notTested.length})</div>
              ${notTestedHtml}
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <span class="wa">📱</span> ${t.pdfFooter}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const html = generatePdfHtml();
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (Platform.OS === 'web') {
        // For web, print directly
        await Print.printAsync({ html });
      } else {
        // For mobile, share the PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: t.downloadPdf,
          UTI: 'com.adobe.pdf',
        });
      }
      
      Alert.alert(t.pdfGenerated);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
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
            size={80}
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
                    size={26}
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

              {/* Custom Notes Input */}
              <TextInput
                style={styles.noteInput}
                placeholder={t.addNotePlaceholder}
                placeholderTextColor={COLORS.textMuted}
                value={notes[item.id]}
                onChangeText={(text) => setNote(item.id, text)}
                multiline={false}
              />

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

        {/* Export Buttons */}
        <View style={styles.exportButtonsContainer}>
          <TouchableOpacity
            style={[styles.exportButton, styles.pdfButton]}
            onPress={handleGeneratePdf}
            disabled={isGeneratingPdf}
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={24}
              color={COLORS.background}
            />
            <Text style={styles.exportButtonText}>
              {isGeneratingPdf ? t.generatingPdf : t.downloadPdf}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, styles.shareImageButton]}
            onPress={() => setShowExportModal(true)}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.shareImageButtonText}>{t.shareResult}</Text>
          </TouchableOpacity>
        </View>
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
                  <Text style={styles.exportTitle}>{t.exportCertTitle}</Text>
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
                      <View key={index}>
                        <Text style={styles.exportItem}>• {item.name}</Text>
                        {item.note ? (
                          <Text style={styles.exportItemNote}>  "{item.note}"</Text>
                        ) : null}
                      </View>
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
                      <View key={index}>
                        <Text style={styles.exportItem}>• {item.name}</Text>
                        {item.note ? (
                          <Text style={styles.exportItemNote}>  "{item.note}"</Text>
                        ) : null}
                      </View>
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
                      <Text key={index} style={[styles.exportItem, { color: COLORS.textMuted }]}>• {item.name}</Text>
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
                  <Text style={styles.watermarkText}>{t.pdfFooter}</Text>
                </View>
              </ViewShot>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.shareButton]}
                  onPress={handleShare}
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
                  onPress={handleGeneratePdf}
                  disabled={isGeneratingPdf}
                >
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={20}
                    color={COLORS.background}
                  />
                  <Text style={styles.downloadButtonText}>
                    {isGeneratingPdf ? t.generatingPdf : 'PDF'}
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
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  illustrationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
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
    padding: SPACING.md,
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
    fontSize: FONT_SIZES.md,
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
    marginBottom: SPACING.sm,
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
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
    marginBottom: SPACING.sm,
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
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
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
    fontSize: FONT_SIZES.sm,
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
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  overallTitle: {
    fontSize: FONT_SIZES.lg,
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
  exportButtonsContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  pdfButton: {
    backgroundColor: COLORS.primary,
  },
  shareImageButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  exportButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  shareImageButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
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
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: 'center',
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
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  exportItemNote: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginLeft: SPACING.xl,
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
