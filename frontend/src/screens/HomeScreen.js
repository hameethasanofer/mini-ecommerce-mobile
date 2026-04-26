import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, StatusBar, RefreshControl,
  Animated, ScrollView, Dimensions,
} from 'react-native';
import Toast from '../components/Toast';
import SkeletonGrid from '../components/SkeletonLoader';
import FilterModal from '../components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getProducts, getCategories, addToCart } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  gold: '#F59E0B',
  text: '#F1F5F9',
  subtext: '#64748B',
  muted: '#1E293B',
  surface: '#0F0F1A',
};

const FEATURED = [
  { id: 'f1', title: 'New Season', subtitle: 'Arrivals 2026', tag: 'Up to 40% off', colors: ['#4F1B8B', '#7C3AED', '#A78BFA'] },
  { id: 'f2', title: 'Premium Tech', subtitle: 'Audio & More', tag: 'Shop Now', colors: ['#0C4A6E', '#0369A1', '#38BDF8'] },
  { id: 'f3', title: 'Street Style', subtitle: 'Footwear Edit', tag: 'Trending', colors: ['#7F1D1D', '#B91C1C', '#F87171'] },
];

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { wishlist } = useWishlist();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ priceRange: 'All', brand: 'All' });
  const scrollX = useRef(new Animated.Value(0)).current;
  const toastRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = { category: selectedCategory, search };
      
      if (activeFilters.brand !== 'All') params.brand = activeFilters.brand;
      if (activeFilters.priceRange !== 'All') {
        if (activeFilters.priceRange === '$0 - $50') { params.minPrice = 0; params.maxPrice = 50; }
        else if (activeFilters.priceRange === '$50 - $150') { params.minPrice = 50; params.maxPrice = 150; }
        else if (activeFilters.priceRange === '$150 - $300') { params.minPrice = 150; params.maxPrice = 300; }
        else if (activeFilters.priceRange === '$300+') { params.minPrice = 300; }
      }

      const [prodData, catData] = await Promise.all([
        getProducts(params),
        getCategories(),
      ]);
      setProducts(prodData.products);
      setCategories(catData.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedCategory, activeFilters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== '') fetchData();
      else if (!loading) fetchData(); // Refresh if search cleared
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setCartCount(c => c + 1);
      toastRef.current?.show('Added to cart! 🛍️', 'success');
    } catch (e) {
      toastRef.current?.show('Failed to add to cart', 'error');
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setIsFilterVisible(false);
  };

  const renderBanner = ({ item }) => (
    <LinearGradient
      colors={item.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerCard}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTag}>
          <Text style={styles.bannerTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Explore</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
    </LinearGradient>
  );

  const renderDot = (index) => {
    const inputRange = [(index - 1) * (width - 40), index * (width - 40), (index + 1) * (width - 40)];
    const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1.4, 0.8], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
    return (
      <Animated.View
        key={index}
        style={[styles.dot, { transform: [{ scale }], opacity }]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          onRefresh={() => { setRefreshing(true); fetchData(); }}
          refreshing={refreshing}
          ListHeaderComponent={
            <>
              {/* ── Header ── */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.greeting}>Good evening 👋</Text>
                  <Text style={styles.storeTitle}>Premium Store</Text>
                </View>
                <View style={styles.headerBtns}>
                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    onPress={() => navigation.navigate('Wishlist')}
                  >
                    <View style={styles.iconCircle}>
                      <Ionicons name="heart-outline" size={22} color={COLORS.text} />
                      {wishlist.length > 0 && (
                        <View style={[styles.cartBadge, { backgroundColor: '#EF4444' }]} />
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cartIconBtn}
                    onPress={() => navigation.navigate('Cart')}
                  >
                    <LinearGradient
                      colors={[COLORS.accentDark, COLORS.accent]}
                      style={styles.cartIconGradient}
                    >
                      <Ionicons name="bag-outline" size={22} color="#FFF" />
                    </LinearGradient>
                    {cartCount > 0 && (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── Search ── */}
              <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={18} color={COLORS.subtext} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search anything..."
                    placeholderTextColor={COLORS.subtext}
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
                  <Ionicons name="options-outline" size={20} color={COLORS.accent} />
                </TouchableOpacity>
              </View>

              {/* ── Featured Banners ── */}
              <View style={styles.bannerSection}>
                <Animated.FlatList
                  data={FEATURED}
                  renderItem={renderBanner}
                  keyExtractor={(i) => i.id}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                  snapToInterval={width - 40}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingRight: 20 }}
                />
                <View style={styles.dotsRow}>
                  {FEATURED.map((_, i) => renderDot(i))}
                </View>
              </View>

              {/* ── Categories ── */}
              <Text style={styles.sectionLabel}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                  >
                    {selectedCategory === cat ? (
                      <LinearGradient colors={[COLORS.accentDark, COLORS.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.catChipGradient}>
                        <Text style={[styles.catText, styles.catTextActive]}>{cat}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.catText}>{cat}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* ── Products Label ── */}
              <View style={styles.productsLabelRow}>
                <Text style={styles.sectionLabel}>
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </Text>
                <Text style={styles.countLabel}>{products.length} items</Text>
              </View>

              {loading && <SkeletonGrid count={6} />}
            </>
          }
          renderItem={!loading ? ({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
              onAddToCart={handleAddToCart}
            />
          ) : () => null}
          ListEmptyComponent={!loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.subtext} />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : null}
        />
      </SafeAreaView>
      <Toast ref={toastRef} />
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  greeting: { fontSize: 13, color: COLORS.subtext, fontWeight: '500', marginBottom: 4 },
  storeTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  headerBtns: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  headerIconBtn: { width: 46, height: 46, borderRadius: 15, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { position: 'relative' },
  cartIconBtn: { position: 'relative' },
  cartIconGradient: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.bg },
  cartBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

  searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 16, height: 52, marginRight: 12, borderWidth: 1, borderColor: COLORS.cardBorder },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15, fontWeight: '500' },
  filterBtn: { width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, justifyContent: 'center', alignItems: 'center' },

  bannerSection: { paddingLeft: 20, marginBottom: 8 },
  bannerCard: { width: width - 60, height: 165, borderRadius: 24, marginRight: 12, padding: 22, overflow: 'hidden', justifyContent: 'center' },
  bannerContent: { zIndex: 2 },
  bannerTag: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  bannerTagText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  bannerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500', marginBottom: 4 },
  bannerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', marginBottom: 16 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  bannerBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  circle1: { position: 'absolute', right: -30, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.07)' },
  circle2: { position: 'absolute', right: 40, bottom: -60, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent, marginHorizontal: 3 },

  sectionLabel: { fontSize: 18, fontWeight: '800', color: COLORS.text, paddingHorizontal: 20, marginBottom: 14, marginTop: 10 },
  catList: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  catChipActive: { borderColor: 'transparent' },
  catChipGradient: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, margin: -1 },
  catText: { fontSize: 13, fontWeight: '600', color: COLORS.subtext },
  catTextActive: { color: '#FFF' },

  productsLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 6 },
  countLabel: { fontSize: 13, color: COLORS.subtext, fontWeight: '500' },

  productList: { paddingHorizontal: 20, paddingBottom: 30 },
  productRow: { justifyContent: 'space-between' },
  loaderContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.subtext },
});

export default HomeScreen;
