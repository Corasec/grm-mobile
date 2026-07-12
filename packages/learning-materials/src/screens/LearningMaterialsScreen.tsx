import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Category, LearningMaterial, LearningMaterialAudience } from '../types';
import { useLearningMaterials } from '../hooks/useLearningMaterials';
import { LearningMaterialsList } from '../components/LearningMaterialsList';

interface LearningMaterialsScreenProps {
  audience?: LearningMaterialAudience;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export function LearningMaterialsScreen({
  audience = 'citizen',
  title,
  subtitle,
  emptyMessage,
}: LearningMaterialsScreenProps) {
  const navigation = useNavigation<any>();
  const { materials, loading, refreshing, error, hasMore, fetchMore, refresh, categories: apiCategories } =
    useLearningMaterials(audience);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All'];
    apiCategories.forEach((c: Category) => cats.push(c.value !== 'All' ? c.label : c.value));
    return cats;
  }, [apiCategories]);

  const filteredMaterials = useMemo(() => {
    let result = materials;
    if (activeFilter !== 'All') {
      result = result.filter(
        (m) => m.category === activeFilter || (m.categories && m.categories.includes(activeFilter)),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [materials, activeFilter, searchQuery]);

  const handleMaterialPress = useCallback(
    (material: LearningMaterial) => {
      navigation.navigate('LearningMaterialDetail', {
        materialId: material.id,
        title: material.title,
      });
    },
    [navigation],
  );

  const handleScroll = useCallback((event: any) => {
    // scroll offset tracking available if needed
  }, []);

  const defaultTitle = 'Learnings';
  const defaultSubtitle = audience === 'facilitator'
    ? 'Training materials for facilitators'
    : 'Explore learning materials';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title || defaultTitle}</Text>
        <Text style={styles.headerSubtitle}>{subtitle || defaultSubtitle}</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#707070" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search learning materials"
            placeholderTextColor="#707070"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={16} color="#707070" />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {categories.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {loading && materials.length === 0 ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#24c38b" />
        </View>
      ) : error && materials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={40} color="#ef6a78" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh} activeOpacity={0.7}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LearningMaterialsList
          materials={filteredMaterials}
          loading={loading}
          refreshing={refreshing}
          error={error}
          hasMore={hasMore}
          onRefresh={refresh}
          onLoadMore={fetchMore}
          onMaterialPress={handleMaterialPress}
          audience={audience}
          emptyMessage={emptyMessage}
          searchQuery={searchQuery}
          activeFilter={activeFilter !== 'All' ? activeFilter : ''}
          onScroll={handleScroll}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#707070',
    marginTop: 4,
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#1f2937',
    paddingVertical: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dedede',
  },
  chipActive: {
    backgroundColor: '#24c38b',
    borderColor: '#24c38b',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#4a4a4a',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
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
});
