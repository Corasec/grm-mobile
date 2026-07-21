import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { LearningMaterial } from '../types';
import { t } from '../local/translations';

interface LearningMaterialCardProps {
  material: LearningMaterial;
  onPress: (material: LearningMaterial) => void;
}

interface TypeColors {
  bg: string;
  fg: string;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; colors: TypeColors }> = {
  video: {
    icon: 'video',
    label: 'Video',
    colors: { bg: '#fee2e2', fg: '#dc2626' },
  },
  article: {
    icon: 'file-text',
    label: 'Article',
    colors: { bg: '#eff6ff', fg: '#3b82f6' },
  },
  pdf: {
    icon: 'file-text',
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
  icon: 'file-text',
  label: 'Article',
  colors: { bg: '#eff6ff', fg: '#3b82f6' },
};

const typeToLabel = (type: string) => {
  switch (type) {
    case 'video': return 'Video'
    case 'article': return 'Article'
    case 'pdf': return 'PDF'
    default: return 'Article'
  }
}

export function LearningMaterialCard({
  material,
  onPress,
}: LearningMaterialCardProps) {
  const typeKey = getTypeKey(material);
  const config = TYPE_CONFIG[typeKey] || DEFAULT_CONFIG;
  const hasImage = !!material.thumbnail;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(material)}
      style={styles.card}
    >
      <View
        style={[
          styles.thumb,
          hasImage && styles.thumbImage,
          !hasImage && { backgroundColor: config.colors.bg },
        ]}
      >
        {hasImage ? (
          <Image
            source={{ uri: material.thumbnail }}
            style={styles.thumbImg}
            resizeMode="cover"
          />
        ) : (
          <Feather name={config.icon as any} size={20} color={config.colors.fg} />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {material.title}
        </Text>
        {material.description ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {material.description}
          </Text>
        ) : null}
        <View style={styles.cardMeta}>
          <View style={[styles.typeTag, { backgroundColor: config.colors.bg }]}>
            <Feather name={config.icon as any} size={10} color={config.colors.fg} />
            <Text style={[styles.typeTagText, { color: config.colors.fg }]}>
              {typeToLabel(typeKey)}
            </Text>
          </View>
          {material.duration ? (
            <View style={styles.durationRow}>
              <Feather name="clock" size={10} color="#707070" />
              <Text style={styles.metaText}>{material.duration} {t('mins')}</Text>
            </View>
          ) : null}
          <View style={styles.metaSpacer} />
          <Feather name="chevron-right" size={14} color="#707070" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e1f2eb',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  thumbImage: {
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 18,
    color: '#1f2937',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 16,
    color: '#707070',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#707070',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 10,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e1f2eb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeTagText: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1a8a5f',
  },
  metaSpacer: {
    flex: 1,
  },
});
