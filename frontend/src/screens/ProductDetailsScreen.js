import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getProductById, addToCart, getProducts } from '../services/api';
import Toast from '../components/Toast';
import ProductCard from '../components/ProductCard';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  gold: '#F59E0B',
  green: '#10B981',
  text: '#F1F5F9',
  subtext: '#64748B',
};

const COLOR_SWATCHES = {
  'Black': '#1A1A1A', 'Black/Black': '#1A1A1A', 'Midnight Black': '#1A1A1A',
  'Midnight': '#1C1C2E', 'Navy': '#1E3A5F', 'Obsidian': '#2D2D3A',
  'Wolf': '#6B7280', 'Smoke': '#9CA3AF', 'Silver': '#C0C0C0', 'Silver/Brown': '#A0856A',
  'White': '#F8FAFC', 'Light Blue': '#BAE6FD', 'Pink': '#FCA5A5', 'Blush Pink': '#FCA5A5',
  'Tan': '#C4956A', 'Charcoal': '#374151', 'Canyon': '#C2713A', 'Sage': '#7D9B76',
  'Gold/Tan': '#C4956A', 'Black/Gold': '#1A1A1A', 'White/Blue': '#F8FAFC',
  'Neon/Black': '#39FF14', 'Deep Marine': '#164E63', 'One Size': '#A78BFA',
  'Standard': '#A78BFA', '20L': '#A78BFA',
};

const ProductDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const toastRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
        setSelectedColor(data.product.colors[0]);
        setSelectedSize(data.product.sizes[0]);

        // Fetch related products
        const related = await getProducts({ category: data.product.category });
        setRelatedProducts(related.products.filter(p => p.id !== id).slice(0, 4));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.94, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    try {
      setAdding(true);
      await addToCart(product.id, 1, selectedColor, selectedSize);
      toastRef.current?.show(`${product.name} added to cart!`, 'success');
      setTimeout(() => setAdding(false), 800);
    } catch (e) {
      toastRef.current?.show('Failed to add to cart', 'error');
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* ── Image Gallery ── */}
        <View style={styles.heroWrap}>
          <FlatList
            data={product.images || [product.image]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={{ width, height: height * 0.52 }}>
                <Image source={{ uri: item }} style={styles.heroImage} />
                <LinearGradient
                  colors={['rgba(10,10,18,0.5)', 'transparent', 'rgba(10,10,18,0.9)']}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={styles.dotRow}>
            {(product.images || [product.image]).map((_, i) => {
              const dotWidth = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [8, 20, 8],
                extrapolate: 'clamp',
              });
              const dotOpacity = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });
              return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} />;
            })}
          </View>
          
          {/* Nav */}
          <SafeAreaView style={styles.heroNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.heroCategory}>{product.category}</Text>
            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="heart-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Price over image */}
          <View style={styles.heroPriceTag}>
            <Text style={styles.heroPriceCurrency}>$</Text>
            <Text style={styles.heroPriceValue}>{product.price.toFixed(0)}</Text>
            {product.discount > 0 && (
              <View style={styles.heroDiscount}>
                <Text style={styles.heroDiscountText}>-{product.discount}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Details Panel ── */}
        <View style={styles.panel}>
          {/* Brand & Name */}
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating & Stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={14} color={COLORS.gold} />
              <Text style={styles.ratingVal}>{product.rating}</Text>
              <Text style={styles.ratingCount}>· {(product.reviews / 1000).toFixed(1)}k reviews</Text>
            </View>
            <View style={styles.stockPill}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>{product.stock} in stock</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Colors */}
          <Text style={styles.sectionTitle}>Color — <Text style={styles.selectedValue}>{selectedColor}</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            {product.colors.map((color) => {
              const swatch = COLOR_SWATCHES[color] || '#888';
              const isSelected = selectedColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[styles.colorSwatch, isSelected && styles.colorSwatchSelected]}
                >
                  <View style={[styles.swatchInner, { backgroundColor: swatch }]} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Sizes */}
          <Text style={styles.sectionTitle}>Size — <Text style={styles.selectedValue}>{selectedSize}</Text></Text>
          <View style={styles.sizesRow}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.sectionTitle}>You might also like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onPress={() => navigation.push('ProductDetails', { id: item.id })}
                    onAddToCart={() => addToCart(item.id).then(() => toastRef.current?.show('Added!', 'success'))}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${product.price.toFixed(2)}</Text>
        </View>
        <Animated.View style={[{ flex: 1 }, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity onPress={handleAddToCart} activeOpacity={0.9} style={{ borderRadius: 20, overflow: 'hidden' }}>
            <LinearGradient
              colors={adding ? ['#10B981', '#059669'] : [COLORS.accentDark, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addCartBtn}
            >
              <Ionicons name={adding ? 'checkmark' : 'cart-outline'} size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.addCartText}>{adding ? 'Added!' : 'Add to Cart'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },

  heroWrap: { width, height: height * 0.52, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dotRow: { position: 'absolute', bottom: 40, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#FFF' },
  heroNav: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  navBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },
  heroCategory: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },

  heroPriceTag: { position: 'absolute', bottom: 20, left: 24, flexDirection: 'row', alignItems: 'flex-end' },
  heroPriceCurrency: { fontSize: 20, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginBottom: 4 },
  heroPriceValue: { fontSize: 52, color: '#FFF', fontWeight: '900', lineHeight: 58 },
  heroDiscount: { marginLeft: 12, marginBottom: 8, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  heroDiscountText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  panel: { backgroundColor: COLORS.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -28, paddingHorizontal: 24, paddingTop: 28 },
  brand: { fontSize: 12, color: COLORS.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  productName: { fontSize: 26, fontWeight: '900', color: COLORS.text, lineHeight: 32, marginBottom: 16 },

  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, gap: 5 },
  ratingVal: { fontSize: 13, fontWeight: '800', color: COLORS.gold },
  ratingCount: { fontSize: 12, color: COLORS.subtext },
  stockPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, gap: 6 },
  stockDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  stockText: { fontSize: 12, color: '#10B981', fontWeight: '600' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  selectedValue: { color: COLORS.text, textTransform: 'none', letterSpacing: 0 },
  description: { fontSize: 15, lineHeight: 25, color: '#94A3B8', marginBottom: 28 },

  colorSwatch: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', marginRight: 10 },
  colorSwatchSelected: { borderColor: COLORS.accent },
  swatchInner: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },

  sizesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  sizeChip: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.cardBorder, backgroundColor: COLORS.card },
  sizeChipActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,58,237,0.15)' },
  sizeText: { fontSize: 13, fontWeight: '600', color: COLORS.subtext },
  sizeTextActive: { color: COLORS.accent },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.cardBorder, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 34, flexDirection: 'row', alignItems: 'center', gap: 16 },
  totalBox: { },
  totalLabel: { fontSize: 11, color: COLORS.subtext, fontWeight: '600', marginBottom: 2 },
  totalAmount: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  addCartBtn: { height: 58, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  addCartText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
});

export default ProductDetailsScreen;
