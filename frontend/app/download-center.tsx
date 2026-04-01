import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../src/context/LanguageContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  icon: 'application-cog' | 'package-variant' | 'tools';
  url: string;
  category: 'tools' | 'drivers' | 'utilities';
}

const downloadItems: DownloadItem[] = [
  {
    id: 'crystaldisk',
    name: 'CrystalDiskInfo',
    description: 'Monitor HDD/SSD health',
    icon: 'application-cog',
    url: 'https://crystalmark.info/en/software/crystaldiskinfo/',
    category: 'tools',
  },
  {
    id: 'hwinfo',
    name: 'HWiNFO',
    description: 'System information & monitoring',
    icon: 'application-cog',
    url: 'https://www.hwinfo.com/download/',
    category: 'tools',
  },
  {
    id: 'rufus',
    name: 'Rufus',
    description: 'Create bootable USB drives',
    icon: 'application-cog',
    url: 'https://rufus.ie/',
    category: 'tools',
  },
  {
    id: 'driverpack',
    name: 'Driver Booster',
    description: 'Auto-detect & update drivers',
    icon: 'package-variant',
    url: 'https://www.iobit.com/en/driver-booster.php',
    category: 'drivers',
  },
  {
    id: 'snappy',
    name: 'Snappy Driver',
    description: 'Offline driver installer',
    icon: 'package-variant',
    url: 'https://sdi-tool.org/',
    category: 'drivers',
  },
  {
    id: 'ccleaner',
    name: 'CCleaner',
    description: 'System optimization & cleaning',
    icon: 'tools',
    url: 'https://www.ccleaner.com/',
    category: 'utilities',
  },
  {
    id: 'treesizefree',
    name: 'TreeSize Free',
    description: 'Disk space analyzer',
    icon: 'tools',
    url: 'https://www.jam-software.com/treesize_free',
    category: 'utilities',
  },
];

export default function DownloadCenterScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const openUrl = async (url: string) => {
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

  const renderCategory = (categoryKey: 'essentialTools' | 'drivers' | 'utilities', category: string) => {
    const items = downloadItems.filter(item => item.category === category);
    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{t[categoryKey]}</Text>
        {items.map(item => (
          <View key={item.id} style={styles.downloadCard}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => openUrl(item.url)}
            >
              <MaterialCommunityIcons
                name="download"
                size={20}
                color={COLORS.background}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
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
        <Text style={styles.headerTitle}>{t.downloadCenterScreenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Illustration */}
        <View style={styles.illustration}>
          <MaterialCommunityIcons
            name="download-circle"
            size={80}
            color={COLORS.primary}
          />
          <Text style={styles.illustrationText}>
            {t.downloadCenterScreenTitle}
          </Text>
        </View>

        {renderCategory('essentialTools', 'tools')}
        {renderCategory('drivers', 'drivers')}
        {renderCategory('utilities', 'utilities')}
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
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  illustrationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.md,
  },
  categorySection: {
    marginBottom: SPACING.xl,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
