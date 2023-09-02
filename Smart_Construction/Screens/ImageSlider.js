import React, { useState } from 'react';
import { View, PanResponder, StyleSheet, Image } from 'react-native';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dx } = gestureState;
      const threshold = 50; // Adjust the threshold to control the scroll sensitivity
      if (dx > threshold) {
        setCurrentIndex((currentIndex + 1) % images.length);
      } else if (dx < -threshold) {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
      }
    },
    onPanResponderRelease: () => {
      // Handle any release events if needed
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image source={{ uri: images[currentIndex] }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageSlider;
