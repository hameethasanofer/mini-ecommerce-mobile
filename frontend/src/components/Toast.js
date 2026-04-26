import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import {
  Animated, Text, StyleSheet, View, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TYPES = {
  success: { icon: 'checkmark-circle', color: '#10B981', bg: 'rgba(16,185,129,0.15)', border: '#10B981' },
  error:   { icon: 'close-circle',     color: '#EF4444', bg: 'rgba(239,68,68,0.15)',  border: '#EF4444' },
  info:    { icon: 'information-circle',color: '#A78BFA', bg: 'rgba(167,139,250,0.15)',border: '#A78BFA' },
  warning: { icon: 'warning',           color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: '#F59E0B' },
};

const Toast = forwardRef((_, ref) => {
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('success');
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timer = useRef(null);

  useImperativeHandle(ref, () => ({
    show(msg, t = 'success') {
      if (timer.current) clearTimeout(timer.current);
      setMessage(msg);
      setType(t);
      Animated.parallel([
        Animated.spring(opacity,    { toValue: 1, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true }),
      ]).start();
      timer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 2500);
    },
  }));

  const cfg = TYPES[type] || TYPES.info;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }], backgroundColor: cfg.bg, borderColor: cfg.border },
      ]}
      pointerEvents="none"
    >
      <Ionicons name={cfg.icon} size={20} color={cfg.color} />
      <Text style={[styles.message, { color: cfg.color }]}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    zIndex: 9999,
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});

export default Toast;
