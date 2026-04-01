import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

type IconName = 'laptop-chromebook' | 'rocket-launch' | 'microsoft-windows' | 'download-circle';

interface MenuCard {
  id: string;
  icon: IconName;
  titleKey: 'checkerTitle' | 'optimizationTitle' | 'installGuideTitle' | 'downloadCenterTitle';
  descKey: 'checkerDesc' | 'optimizationDesc' | 'installGuideDesc' | 'downloadCenterDesc';
  route: '/checker' | '/optimization' | '/install-guide' | '/download-center';
}

const menuCards: MenuCard[] = [
  {
    id: 'checker',
    icon: 'laptop-chromebook',
    titleKey: 'checkerTitle',
    descKey: 'checkerDesc',
    route: '/checker',
  },
  {
    id: 'optimization',
    icon: 'rocket-launch',
    titleKey: 'optimizationTitle',
    descKey: 'optimizationDesc',
    route: '/optimization',
  },
  {
    id: 'install',
    icon: 'microsoft-windows',
    titleKey: 'installGuideTitle',
    descKey: 'installGuideDesc',
    route: '/install-guide',
  },
  {
    id: 'download',
    icon: 'download-circle',
    titleKey: 'downloadCenterTitle',
    descKey: 'downloadCenterDesc',
    route: '/download-center',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { language, t, toggleLanguage } = useLanguage();

  const renderMenuCard = (item: MenuCard) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => router.push(item.route)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIconContainer}>
        <MaterialCommunityIcons
          name={item.icon}
          size={32}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.cardTitle}>{t[item.titleKey]}</Text>
      <Text style={styles.cardDesc}>{t[item.descKey]}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t.appTitle}</Text>
            <Text style={styles.subtitle}>{t.appSubtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.languageToggle}
            onPress={toggleLanguage}
          >
            <Text style={styles.languageText}>
              {language === 'id' ? 'EN' : 'ID'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImagePlaceholder}>
            <MaterialCommunityIcons
              name="laptop"
              size={120}
              color={COLORS.primary}
            />
            <Text style={styles.heroText}>{t.appTitle}</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuCards.map(renderMenuCard)}
        </View>

        {/* Promotional Banner */}
        <TouchableOpacity
          style={styles.promoBanner}
          onPress={() => router.push('/license')}
          activeOpacity={0.8}
        >
          <View style={styles.promoContent}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={40}
              color="#25D366"
            />
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>{t.promoTitle}</Text>
              <Text style={styles.promoDesc}>{t.promoDesc}</Text>
            </View>
          </View>
          <View style={styles.promoButton}>
            <Text style={styles.promoButtonText}>{t.orderNow}</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={COLORS.background}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  languageToggle: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  heroSection: {
    marginBottom: SPACING.xl,
  },
  heroImagePlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  heroText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
    marginTop: SPACING.md,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    lineHeight: 18,
  },
  promoBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  promoTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  promoTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  promoDesc: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  promoButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  promoButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
  },
});
