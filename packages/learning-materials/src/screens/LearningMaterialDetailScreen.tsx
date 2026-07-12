import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useLearningMaterialDetail } from '../hooks/useLearningMaterials';
import { LearningMaterial } from '../types';
import { t } from '../local/translations';

type DetailParams = {
  LearningMaterialDetail: {
    materialId: string;
    title?: string;
  };
};

interface TypeColors {
  bg: string;
  fg: string;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; colors: TypeColors }> = {
  video: {
    icon: 'videocam',
    label: 'Video',
    colors: { bg: '#fee2e2', fg: '#dc2626' },
  },
  article: {
    icon: 'document-text',
    label: 'Article',
    colors: { bg: '#dbeafe', fg: '#3b82f6' },
  },
  pdf: {
    icon: 'document',
    label: 'PDF',
    colors: { bg: '#fef9c3', fg: '#ca8a04' },
  },
};

function getTypeKey(material: LearningMaterial): string {
  if (material.content_type === 'pdf') return 'pdf';
  if (material.content_type) return material.content_type;
  if (material.file_type === 'pdf') return 'pdf';
  return 'article';
}

const DEFAULT_CONFIG = {
  icon: 'document-text',
  label: 'Article',
  colors: { bg: '#dbeafe', fg: '#3b82f6' },
};

const typeToLabel = (type: string) => {
  switch (type) {
    case 'video': return 'Video';
    case 'article': return 'Article';
    case 'pdf': return 'PDF';
    default: return 'Article';
  }
};

function getFileSizeHint(material: LearningMaterial): string {
  return material.file_type?.toUpperCase() || 'PDF';
}

export function LearningMaterialDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<DetailParams, 'LearningMaterialDetail'>>();
  const { materialId } = route.params;
  const { material, loading, error } = useLearningMaterialDetail(materialId);

  const typeKey = useMemo(
    () => (material ? getTypeKey(material) : 'article'),
    [material],
  );

  const typeConfig = TYPE_CONFIG[typeKey] || DEFAULT_CONFIG;

  const hasFile = !!(material?.file);

  const handleDownload = useCallback(async () => {
    if (!material?.file) return;
    const canOpen = await Linking.canOpenURL(material.file);
    if (canOpen) await Linking.openURL(material.file);
  }, [material]);

  const handleContentUrl = useCallback(async () => {
    if (!material?.content_url) return;
    const canOpen = await Linking.canOpenURL(material.content_url);
    if (canOpen) await Linking.openURL(material.content_url);
  }, [material]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </SafeAreaView>
    );
  }

  if (error || !material) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Ionicons name="alert-circle" size={40} color="#ef6a78" />
        <Text style={styles.errorText}>{error || 'Material not found'}</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.goBackButtonText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#22C55E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero Card */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroGradient}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="document-outline" size={48} color="#ffffff" />
            </View>
          </View>
        </View>

        {/* Metadata Row */}
        <View style={styles.metaRow}>
          <View style={[styles.typePill, { backgroundColor: typeConfig.colors.bg }]}>
            <Ionicons
              name={typeConfig.icon as any}
              size={12}
              color={typeConfig.colors.fg}
            />
            <Text style={[styles.typePillText, { color: typeConfig.colors.fg }]}>
              {typeConfig.label}
            </Text>
          </View>
          {material.duration ? (
            <View style={styles.durationItem}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.durationText}>
                {material.duration} {t('mins')}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text style={styles.title}>{material.title}</Text>

        {/* Description */}
        {material.description ? (
          <Text style={styles.description}>{material.description}</Text>
        ) : null}

        {/* Attachments Section */}
        {hasFile && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.attachmentsHeading}>Attachments</Text>

            <TouchableOpacity
              style={styles.attachmentCard}
              onPress={handleDownload}
              activeOpacity={0.7}
            >
              <View style={styles.attachmentIconWrapper}>
                <Ionicons name="document-text" size={22} color="#22C55E" />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {material.title}.pdf
                </Text>
                <Text style={styles.attachmentSize}>
                  {getFileSizeHint(material)}
                </Text>
              </View>
              <Ionicons name="download-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        {/* Content URL attachment */}
        {material.content_url && (
          <View style={styles.attachmentsSection}>
            {!hasFile && <Text style={styles.attachmentsHeading}>Attachments</Text>}
            <TouchableOpacity
              style={styles.attachmentCard}
              onPress={handleContentUrl}
              activeOpacity={0.7}
            >
              <View style={styles.attachmentIconWrapper}>
                <Ionicons name="link" size={22} color="#22C55E" />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  Open resource link
                </Text>
                <Text style={styles.attachmentSize}>Link</Text>
              </View>
              <Ionicons name="download-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#ef6a78',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  goBackButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  goBackButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#ffffff',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },

  /* ScrollView */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  /* Hero Card */
  heroWrapper: {
    marginTop: 12,
    marginBottom: 16,
  },
  heroGradient: {
    height: 170,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B8BA8',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* Metadata Row */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typePillText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
  durationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },

  /* Title */
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#1F2937',
    lineHeight: 38,
    marginBottom: 12,
  },

  /* Description */
  description: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },

  /* Attachments */
  attachmentsSection: {
    marginTop: 24,
  },
  attachmentsHeading: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    gap: 12,
  },
  attachmentIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
  },
});
