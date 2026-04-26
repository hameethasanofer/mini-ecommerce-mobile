import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_W = (width - 60) / 2;

const COLORS = {
  base: '#1A1A2E',
  highlight: '#252540',
};

// Single shimmer bar
const ShimmerBar = ({ style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return <Animated.View style={[styles.bar, style, { opacity }]} />;
};

// A single skeleton product card
export const SkeletonCard = () => (
  <View style={styles.card}>
    <ShimmerBar style={styles.imgPlaceholder} />
    <View style={styles.body}>
      <ShimmerBar style={[styles.line, { width: '45%', height: 9 }]} />
      <ShimmerBar style={[styles.line, { width: '85%', height: 13, marginTop: 6 }]} />
      <ShimmerBar style={[styles.line, { width: '55%', height: 9, marginTop: 8 }]} />
      <View style={styles.priceRow}>
        <ShimmerBar style={[styles.line, { width: '40%', height: 16 }]} />
        <ShimmerBar style={styles.circle} />
      </View>
    </View>
  </View>
);

// Full grid of skeletons
const SkeletonGrid = ({ count = 6 }) => (
  <View style={styles.grid}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#13131F',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E30',
    overflow: 'hidden',
    marginBottom: 20,
  },
  imgPlaceholder: {
    width: '100%',
    height: 175,
    backgroundColor: COLORS.base,
  },
  body: {
    padding: 12,
  },
  line: {
    backgroundColor: COLORS.base,
    borderRadius: 6,
    height: 10,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.base,
  },
  bar: {
    borderRadius: 6,
    backgroundColor: COLORS.base,
  },
});

export default SkeletonGrid;
