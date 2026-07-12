import React from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { LearningMaterial, LearningMaterialAudience } from '../types';
import { LearningMaterialCard } from './LearningMaterialCard';

interface LearningMaterialsListProps {
  materials: LearningMaterial[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onMaterialPress: (material: LearningMaterial) => void;
  audience?: LearningMaterialAudience;
  emptyMessage?: string;
  searchQuery?: string;
  activeFilter?: string;
  onScroll?: (event: any) => void;
}

export function LearningMaterialsList({
  materials,
  loading,
  refreshing,
  error,
  hasMore,
  onRefresh,
  onLoadMore,
  onMaterialPress,
  audience,
  emptyMessage,
  searchQuery,
  activeFilter,
  onScroll,
}: LearningMaterialsListProps) {
  const renderSectionHeader = () => (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>
        {audience === 'facilitator' ? 'Recommended for your role' : 'For you'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore || materials.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#24c38b" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    const hasFilters = !!(searchQuery || activeFilter);
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name={hasFilters ? 'search' : 'book-open'}
          size={40}
          color="#ccc"
        />
        <Text style={styles.emptyText}>
          {hasFilters
            ? 'No learning materials match your search'
            : emptyMessage || 'No learning materials available yet'}
        </Text>
      </View>
    );
  };

  if (loading && materials.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#24c38b" />
      </View>
    );
  }

  if (error && materials.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="alert-circle" size={40} color="#ef6a78" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh} activeOpacity={0.7}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={materials}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LearningMaterialCard material={item} onPress={onMaterialPress} />
      )}
      ListHeaderComponent={renderSectionHeader}
      contentContainerStyle={
        materials.length === 0 ? styles.listContentEmpty : styles.listContent
      }
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 80,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
    color: '#1f2937',
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#707070',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#ef6a78',
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: '#24c38b',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
