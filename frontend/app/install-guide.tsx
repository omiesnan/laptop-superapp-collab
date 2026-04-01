import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

interface StepData {
  id: number;
  titleKey: string;
  descKey: string;
  icon: 'usb-flash-drive' | 'cogs' | 'harddisk' | 'account-check';
}

const steps: StepData[] = [
  { id: 1, titleKey: 'preparation', descKey: 'preparationDesc', icon: 'usb-flash-drive' },
  { id: 2, titleKey: 'biosUefi', descKey: 'biosUefiDesc', icon: 'cogs' },
  { id: 3, titleKey: 'installation', descKey: 'installationDesc', icon: 'harddisk' },
  { id: 4, titleKey: 'finalSetup', descKey: 'finalSetupDesc', icon: 'account-check' },
];

export default function InstallGuideScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [showVersionModal, setShowVersionModal] = useState(false);

  const goToPage = (page: number) => {
    if (page >= 0 && page < steps.length) {
      setCurrentPage(page);
    }
  };

  const currentStep = steps[currentPage];

  const renderStepContent = () => {
    switch (currentPage) {
      case 0: // Step 1: Persiapan
        return (
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.contentText}>{t.preparationContent1}</Text>
              </View>
              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert" size={20} color={COLORS.error} />
                <Text style={styles.warningText}>{t.preparationWarning1}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.contentText}>{t.preparationContent2}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.contentText}>{t.preparationContent3}</Text>
              </View>

              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={18} color={COLORS.info} />
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>GPT</Text> = UEFI (Laptop baru){'\n'}
                  <Text style={styles.boldText}>MBR</Text> = Legacy (Laptop lama)
                </Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>4</Text>
                </View>
                <Text style={styles.contentText}>{t.preparationContent4}</Text>
              </View>

              <TouchableOpacity
                style={styles.versionButton}
                onPress={() => setShowVersionModal(true)}
              >
                <MaterialCommunityIcons name="microsoft-windows" size={20} color={COLORS.primary} />
                <Text style={styles.versionButtonText}>{t.windowsVersionTitle}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 1: // Step 2: BIOS/UEFI
        return (
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.contentText}>{t.biosContent1}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.contentText}>{t.biosContent2}</Text>
              </View>

              <View style={styles.keyboardBox}>
                <Text style={styles.keyboardTitle}>Tombol BIOS berdasarkan Merk:</Text>
                <View style={styles.keyRow}>
                  <View style={styles.keyItem}>
                    <Text style={styles.keyBrand}>ASUS</Text>
                    <Text style={styles.keyValue}>F2 / Del</Text>
                  </View>
                  <View style={styles.keyItem}>
                    <Text style={styles.keyBrand}>Lenovo</Text>
                    <Text style={styles.keyValue}>F2 / F12</Text>
                  </View>
                </View>
                <View style={styles.keyRow}>
                  <View style={styles.keyItem}>
                    <Text style={styles.keyBrand}>HP</Text>
                    <Text style={styles.keyValue}>F10 / Esc</Text>
                  </View>
                  <View style={styles.keyItem}>
                    <Text style={styles.keyBrand}>Acer</Text>
                    <Text style={styles.keyValue}>F2 / Del</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.contentText}>{t.biosContent3}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>4</Text>
                </View>
                <Text style={styles.contentText}>{t.biosContent4}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>5</Text>
                </View>
                <Text style={styles.contentText}>{t.biosContent5}</Text>
              </View>

              <View style={styles.tipBox}>
                <MaterialCommunityIcons name="lightbulb-on" size={18} color={COLORS.warning} />
                <Text style={styles.tipText}>{t.biosTip}</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 2: // Step 3: Instalasi & Partisi
        return (
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.contentText}>{t.installContent1}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.contentText}>{t.installContent2}</Text>
              </View>

              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert" size={20} color={COLORS.error} />
                <Text style={styles.warningText}>{t.installWarning1}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.contentText}>{t.installContent3}</Text>
              </View>

              <View style={styles.dangerBox}>
                <MaterialCommunityIcons name="alert-octagon" size={22} color="#FFFFFF" />
                <Text style={styles.dangerText}>{t.installWarning2}</Text>
              </View>

              <View style={styles.partitionInfo}>
                <Text style={styles.partitionTitle}>Panduan Partisi:</Text>
                <View style={styles.partitionItem}>
                  <View style={[styles.partitionDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.partitionText}>
                    <Text style={styles.boldText}>Drive 0 (C:)</Text> - Hapus ini untuk install Windows baru
                  </Text>
                </View>
                <View style={styles.partitionItem}>
                  <View style={[styles.partitionDot, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.partitionText}>
                    <Text style={styles.boldText}>Drive 1 (D:)</Text> - JANGAN HAPUS! Ini data pribadi lu
                  </Text>
                </View>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>4</Text>
                </View>
                <Text style={styles.contentText}>{t.installContent4}</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 3: // Step 4: Setup Akhir
        return (
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.contentText}>{t.finalContent1}</Text>
              </View>

              <View style={styles.trickBox}>
                <View style={styles.trickHeader}>
                  <MaterialCommunityIcons name="star" size={20} color={COLORS.warning} />
                  <Text style={styles.trickTitle}>{t.finalTrick}</Text>
                </View>
                <Text style={styles.trickText}>{t.finalContent2}</Text>
                <View style={styles.commandBox}>
                  <Text style={styles.commandText}>{t.finalCommand}</Text>
                </View>
                <Text style={styles.trickText}>{t.finalContent3}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.contentText}>{t.finalContent4}</Text>
              </View>

              <View style={styles.contentItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.contentText}>{t.finalContent5}</Text>
              </View>

              <View style={styles.completeBox}>
                <MaterialCommunityIcons name="check-decagram" size={40} color={COLORS.success} />
                <Text style={styles.completeTitle}>{t.installComplete}</Text>
                <Text style={styles.completeDesc}>{t.installCompleteDesc}</Text>
                
                <TouchableOpacity
                  style={styles.optimizeButton}
                  onPress={() => router.push('/optimization')}
                >
                  <Text style={styles.optimizeButtonText}>{t.continueToOptimization}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.background} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

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
        <Text style={styles.headerTitle}>{t.installGuideMasterclass}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={styles.progressItem}
            onPress={() => goToPage(index)}
          >
            <View
              style={[
                styles.progressDot,
                index <= currentPage && styles.progressDotActive,
              ]}
            >
              <Text
                style={[
                  styles.progressNumber,
                  index <= currentPage && styles.progressNumberActive,
                ]}
              >
                {step.id}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < currentPage && styles.progressLineActive,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Step Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <MaterialCommunityIcons
            name={currentStep.icon}
            size={32}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={styles.stepLabel}>
            {t.step} {currentStep.id} / {steps.length}
          </Text>
          <Text style={styles.stepTitle}>{t[currentStep.titleKey as keyof typeof t]}</Text>
          <Text style={styles.stepDesc}>{t[currentStep.descKey as keyof typeof t]}</Text>
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.contentContainer}>
        {renderStepContent()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={currentPage === 0 ? COLORS.textMuted : COLORS.primary}
          />
          <Text
            style={[
              styles.navButtonText,
              currentPage === 0 && styles.navButtonTextDisabled,
            ]}
          >
            {t.prevStep}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonPrimary,
            currentPage === steps.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage === steps.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              styles.navButtonTextPrimary,
              currentPage === steps.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            {t.nextStep}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={
              currentPage === steps.length - 1
                ? COLORS.textMuted
                : COLORS.background
            }
          />
        </TouchableOpacity>
      </View>

      {/* Windows Version Modal */}
      <Modal
        visible={showVersionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVersionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="microsoft-windows" size={32} color={COLORS.primary} />
              <Text style={styles.modalTitle}>{t.windowsVersionTitle}</Text>
            </View>

            <View style={styles.versionCard}>
              <View style={styles.versionHeader}>
                <MaterialCommunityIcons name="shield-crown" size={24} color="#0078D4" />
                <Text style={styles.versionTitle}>{t.windowsProTitle}</Text>
              </View>
              <Text style={styles.versionDesc}>{t.windowsProDesc}</Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• BitLocker Encryption</Text>
                <Text style={styles.featureItem}>• Remote Desktop</Text>
                <Text style={styles.featureItem}>• Group Policy Editor</Text>
              </View>
            </View>

            <View style={styles.versionCard}>
              <View style={styles.versionHeader}>
                <MaterialCommunityIcons name="home" size={24} color={COLORS.primary} />
                <Text style={styles.versionTitle}>{t.windowsHomeTitle}</Text>
              </View>
              <Text style={styles.versionDesc}>{t.windowsHomeDesc}</Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• Lebih ringan</Text>
                <Text style={styles.featureItem}>• Cocok untuk sehari-hari</Text>
                <Text style={styles.featureItem}>• Harga lebih murah</Text>
              </View>
            </View>

            <View style={styles.noteBox}>
              <MaterialCommunityIcons name="information" size={18} color={COLORS.warning} />
              <Text style={styles.noteText}>{t.windowsVersionNote}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowVersionModal(false)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
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
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surfaceBorder,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  progressNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  progressNumberActive: {
    color: COLORS.background,
  },
  progressLine: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.surfaceBorder,
    marginHorizontal: 2,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  stepIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepHeaderText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  stepLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  stepDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  contentScroll: {
    flex: 1,
  },
  stepContent: {
    paddingBottom: SPACING.xl,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  numberText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  contentText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    gap: SPACING.sm,
  },
  warningText: {
    flex: 1,
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  dangerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  dangerText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    color: COLORS.info,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  tipText: {
    flex: 1,
    color: COLORS.warning,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
  keyboardBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  keyboardTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  keyRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  keyItem: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  keyBrand: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
  },
  keyValue: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  partitionInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  partitionTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  partitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  partitionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  partitionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  trickBox: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  trickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  trickTitle: {
    color: COLORS.warning,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  trickText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
  commandBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: SPACING.sm,
  },
  commandText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  completeBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  completeTitle: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  completeDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  optimizeButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  versionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SPACING.sm,
  },
  versionButtonText: {
    flex: 1,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  navButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  navButtonDisabled: {
    borderColor: COLORS.surfaceBorder,
    backgroundColor: 'transparent',
  },
  navButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  navButtonTextPrimary: {
    color: COLORS.background,
  },
  navButtonTextDisabled: {
    color: COLORS.textMuted,
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
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  versionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  versionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  versionDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  featureList: {
    marginTop: SPACING.sm,
  },
  featureItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  noteText: {
    flex: 1,
    color: COLORS.warning,
    fontSize: FONT_SIZES.sm,
  },
  modalCloseButton: {
    alignItems: 'center',
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  modalCloseText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
  },
});
