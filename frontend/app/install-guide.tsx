import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

const { width } = Dimensions.get('window');

interface Step {
  id: number;
  titleKey: 'preparation' | 'biosUefi' | 'installation';
  descKey: 'preparationDesc' | 'biosUefiDesc' | 'installationDesc';
  icon: 'usb-flash-drive' | 'cogs' | 'microsoft-windows';
}

const steps: Step[] = [
  {
    id: 1,
    titleKey: 'preparation',
    descKey: 'preparationDesc',
    icon: 'usb-flash-drive',
  },
  {
    id: 2,
    titleKey: 'biosUefi',
    descKey: 'biosUefiDesc',
    icon: 'cogs',
  },
  {
    id: 3,
    titleKey: 'installation',
    descKey: 'installationDesc',
    icon: 'microsoft-windows',
  },
];

export default function InstallGuideScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goToPage = (page: number) => {
    if (page >= 0 && page < steps.length) {
      setCurrentPage(page);
      scrollRef.current?.scrollTo({ x: page * (width - SPACING.lg * 2), animated: true });
    }
  };

  const currentStep = steps[currentPage];

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
        <Text style={styles.headerTitle}>{t.installGuideScreenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.progressItem}>
            <TouchableOpacity
              style={[
                styles.progressDot,
                index <= currentPage && styles.progressDotActive,
              ]}
              onPress={() => goToPage(index)}
            >
              <Text
                style={[
                  styles.progressNumber,
                  index <= currentPage && styles.progressNumberActive,
                ]}
              >
                {step.id}
              </Text>
            </TouchableOpacity>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < currentPage && styles.progressLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Content Area */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Illustration */}
        <View style={styles.illustration}>
          <MaterialCommunityIcons
            name={currentStep.icon}
            size={100}
            color={COLORS.primary}
          />
        </View>

        {/* Step Content */}
        <View style={styles.content}>
          <Text style={styles.stepLabel}>
            {t.step} {currentStep.id}
          </Text>
          <Text style={styles.stepTitle}>{t[currentStep.titleKey]}</Text>
          <Text style={styles.stepDesc}>{t[currentStep.descKey]}</Text>
        </View>
      </ScrollView>

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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  progressNumberActive: {
    color: COLORS.background,
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.surfaceBorder,
    marginHorizontal: SPACING.xs,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  illustration: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  content: {
    flex: 1,
  },
  stepLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  stepDesc: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    lineHeight: 28,
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
});
