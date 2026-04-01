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

interface OptimizationItem {
  id: string;
  titleKey: 'startupApps' | 'powerPlan' | 'debloating' | 'tempFiles';
  descKey: 'startupAppsDesc' | 'powerPlanDesc' | 'debloatingDesc' | 'tempFilesDesc';
  detailKey: 'startupAppsDetail' | 'powerPlanDetail' | 'debloatingDetail' | 'tempFilesDetail';
  icon: 'rocket-launch' | 'lightning-bolt' | 'package-variant-closed-remove' | 'folder-remove';
}

const optimizationItems: OptimizationItem[] = [
  {
    id: 'startup',
    titleKey: 'startupApps',
    descKey: 'startupAppsDesc',
    detailKey: 'startupAppsDetail',
    icon: 'rocket-launch',
  },
  {
    id: 'power',
    titleKey: 'powerPlan',
    descKey: 'powerPlanDesc',
    detailKey: 'powerPlanDetail',
    icon: 'lightning-bolt',
  },
  {
    id: 'debloat',
    titleKey: 'debloating',
    descKey: 'debloatingDesc',
    detailKey: 'debloatingDetail',
    icon: 'package-variant-closed-remove',
  },
  {
    id: 'temp',
    titleKey: 'tempFiles',
    descKey: 'tempFilesDesc',
    detailKey: 'tempFilesDetail',
    icon: 'folder-remove',
  },
];

export default function OptimizationScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
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
        <Text style={styles.headerTitle}>{t.optimizationScreenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Illustration */}
        <View style={styles.illustration}>
          <MaterialCommunityIcons
            name="speedometer"
            size={80}
            color={COLORS.primary}
          />
          <Text style={styles.illustrationText}>
            {t.optimizationScreenTitle}
          </Text>
        </View>

        {/* Optimization Items */}
        {optimizationItems.map(item => (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={28}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{t[item.titleKey]}</Text>
                <Text style={styles.cardDesc}>{t[item.descKey]}</Text>
              </View>
              <MaterialCommunityIcons
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* Illustration Placeholder */}
            <View style={styles.cardIllustration}>
              <MaterialCommunityIcons
                name={item.icon}
                size={40}
                color={COLORS.primaryDark}
              />
            </View>

            {/* Expandable Detail */}
            {expandedId === item.id && (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>{t.viewDetails}</Text>
                <Text style={styles.detailText}>
                  {t[item.detailKey].replace(/\\n/g, '\n')}
                </Text>
              </View>
            )}

            {/* Toggle Button */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={styles.toggleButtonText}>
                {expandedId === item.id ? t.hideDetails : t.viewDetails}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
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
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  cardIllustration: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailSection: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  detailTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  detailText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  toggleButton: {
    padding: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
  },
  toggleButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
});
