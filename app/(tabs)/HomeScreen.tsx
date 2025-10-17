import { useIsFocused } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SplashScreen from "../candy-crush/SplashScreen";

const HomeScreen:FC = () => {
  const isFocus = useIsFocused();
  const translateY = useSharedValue(-200);
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 5000 });
  }, [isFocus]);
const animatedStyle =useAnimatedStyle(() => {
  return {
    transform: [{ translateY: translateY.value }],
  };
});


  const [splashScreen, setSplashScreen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  if (splashScreen) {
    return <SplashScreen />;
  }
  return (
    <ImageBackground
      source={require("../../assets/images/candy-home-bg.png")}
      style={styles.background}
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      <Animated.Image
        source={require("../../assets/images/candy-logo1.png")}
        style={[styles.img,animatedStyle]}
      />
    </ImageBackground>
  );
};

export default HomeScreen;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img:{
    width: screenWidth,
    height: screenWidth*0.6,
    position: 'absolute',
    // top: '30%',
    resizeMode: 'contain',
  }
});
