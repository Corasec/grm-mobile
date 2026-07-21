import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { LearningMaterial } from '../types';

interface LearningMaterialViewerProps {
  material: LearningMaterial;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function LearningMaterialViewer({
  material,
}: LearningMaterialViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (material.file_type === 'pdf') {
    return (
      <View style={styles.pdfContainer}>
        <View style={styles.pdfIconContainer}>
          <Text style={styles.pdfIcon}>📄</Text>
        </View>
        <Text style={styles.pdfTitle}>{material.title}</Text>
        {material.description ? (
          <Text style={styles.pdfDescription}>{material.description}</Text>
        ) : null}
        <Text style={styles.pdfHint}>
          Appuyez pour télécharger et ouvrir le PDF
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#24c38b"
          style={StyleSheet.absoluteFill}
        />
      )}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Impossible de charger l'image</Text>
        </View>
      ) : (
        <Image
          source={{ uri: material.file }}
          style={styles.image}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  pdfIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e8f8f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pdfIcon: {
    fontSize: 36,
  },
  pdfTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  pdfDescription: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#707070',
    textAlign: 'center',
    marginBottom: 16,
  },
  pdfHint: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#24c38b',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#ef6a78',
    textAlign: 'center',
  },
});
