// dogpad.mobile/components/ui/IconSymbol.jsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

const IconSymbol = ({ name, size, color, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconSymbol;
