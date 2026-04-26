import React, { useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '../context/WishlistContext';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  gold: '#F59E0B',
  green: '#10B981',
  danger: '#EF4444',
  text: '#F1F5F9',
  subtext: '#64748B',
  muted: '#334155',
};

const ProductCard = ({ product, onPress, onAddToCart }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleHeartPress = () => {
    toggleWishlist(product);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.card}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,18,0.7)']}
            style={styles.imageGradient}
          />
          {product.discount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>-{product.discount}%</Text>
            </View>
          )}
          {product.tags.includes('new') && (
            <View style={[styles.badge, styles.newBadge]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {/* Heart button */}
          <TouchableOpacity style={styles.heartBtn} onPress={handleHeartPress}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={wishlisted ? 'heart' : 'heart-outline'}
                size={18}
                color={wishlisted ? '#EF4444' : 'rgba(255,255,255,0.8)'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={COLORS.gold} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})</Text>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>${product.price.toFixed(0)}</Text>
              {product.discount > 0 && (
                <Text style={styles.originalPrice}>${product.originalPrice.toFixed(0)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddToCart(product.id)}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addBtnGradient}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '47%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadge: {
    top: 10,
    left: 'auto',
    right: 10,
    backgroundColor: COLORS.green,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 9,
    color: COLORS.accent,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 3,
  },
  reviews: {
    fontSize: 10,
    color: COLORS.subtext,
    marginLeft: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.subtext,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGradient: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
