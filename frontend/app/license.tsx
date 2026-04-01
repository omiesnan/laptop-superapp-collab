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
import { getWhatsAppUrl } from '../src/constants/whatsapp';

interface LicenseItem {
  id: string;
  titleKey: 'ebookTitle' | 'windowsLicense' | 'officeLicense';
  descKey: 'ebookDesc' | 'windowsLicenseDesc' | 'officeLicenseDesc';
  messageKey: 'waMessageEbook' | 'waMessageWindows' | 'waMessageOffice';
  icon: 'book-open-page-variant' | 'microsoft-windows' | 'microsoft-office';
  color: string;
}

const licenseItems: LicenseItem[] = [
  {
    id: 'ebook',
    titleKey: 'ebookTitle',
    descKey: 'ebookDesc',
    messageKey: 'waMessageEbook',
    icon: 'book-open-page-variant',
    color: '#4CAF50',
  },
  {
    id: 'windows',
    titleKey: 'windowsLicense',
    descKey: 'windowsLicenseDesc',
    messageKey: 'waMessageWindows',
    icon: 'microsoft-windows',
    color: '#0078D4',
  },
  {
    id: 'office',
    titleKey: 'officeLicense',
    descKey: 'officeLicenseDesc',
    messageKey: 'waMessageOffice',
    icon: 'microsoft-office',
    color: '#D83B01',
  },
];

export default function LicenseScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const openWhatsApp = async (message: string) => {
    try {
      const url = getWhatsAppUrl(message);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp');
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
        <Text style={styles.headerTitle}>{t.licenseScreenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="certificate"
              size={60}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.heroTitle}>{t.licenseScreenTitle}</Text>
          <Text style={styles.heroDesc}>{t.licenseDesc}</Text>
        </View>

        {/* License Items */}
        {licenseItems.map(item => (
          <View key={item.id} style={styles.licenseCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={item.color}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{t[item.titleKey]}</Text>
                <Text style={styles.cardDesc}>{t[item.descKey]}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => openWhatsApp(t[item.messageKey])}
            >
              <MaterialCommunityIcons
                name="whatsapp"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.whatsappButtonText}>
                {t.contactWhatsApp}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* General Contact */}
        <TouchableOpacity
          style={styles.generalContact}
          onPress={() => openWhatsApp(t.waMessageGeneral)}
        >
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.generalContactText}>
            {t.contactWhatsApp}
          </Text>
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
  heroSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  licenseCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
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
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  generalContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SPACING.md,
  },
  generalContactText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
});
