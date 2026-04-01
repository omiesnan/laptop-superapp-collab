import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

interface CheckItem {
  id: string;
  titleKey: 'screenDisplay' | 'keyboard' | 'battery' | 'diskHealth';
  descKey: 'screenDisplayDesc' | 'keyboardDesc' | 'batteryDesc' | 'diskHealthDesc';
  icon: 'monitor' | 'keyboard' | 'battery' | 'harddisk';
}

const checkItems: CheckItem[] = [
  {
    id: 'screen',
    titleKey: 'screenDisplay',
    descKey: 'screenDisplayDesc',
    icon: 'monitor',
  },
  {
    id: 'keyboard',
    titleKey: 'keyboard',
    descKey: 'keyboardDesc',
    icon: 'keyboard',
  },
  {
    id: 'battery',
    titleKey: 'battery',
    descKey: 'batteryDesc',
    icon: 'battery',
  },
  {
    id: 'disk',
    titleKey: 'diskHealth',
    descKey: 'diskHealthDesc',
    icon: 'harddisk',
  },
];

export default function CheckerScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [results, setResults] = useState<Record<string, boolean | null>>({
    screen: null,
    keyboard: null,
    battery: null,
    disk: null,
  });

  const setResult = (id: string, passed: boolean) => {
    setResults(prev => ({ ...prev, [id]: passed }));
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

  const overall = getOverallCondition();

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
            name="laptop-chromebook"
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
        {checkItems.map(item => (
          <View key={item.id} style={styles.checkItem}>
            <View style={styles.checkItemHeader}>
              <View style={styles.checkItemInfo}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={28}
                  color={COLORS.primary}
                />
                <View style={styles.checkItemText}>
                  <Text style={styles.checkItemTitle}>{t[item.titleKey]}</Text>
                  <Text style={styles.checkItemDesc}>{t[item.descKey]}</Text>
                </View>
              </View>
            </View>
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
        ))}

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
      </ScrollView>
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
    marginBottom: SPACING.md,
  },
  checkItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkItemText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  checkItemTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  checkItemDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
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
});
