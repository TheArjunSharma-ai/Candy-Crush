import { useIsFocused } from "@react-navigation/native";
import { navigate } from "expo-router/build/global-state/routing";
import React, { FC, useEffect, useState } from "react";
import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSound } from "../candy-crush/SoundContext";
import SplashScreen from "../candy-crush/SplashScreen";
import ScalePress from "../candy-crush/component/ui/ScalePress";
import LevelScreen from "../candy-crush/LevelScreen";

const HomeScreen: FC = () => {
  const { playSound } = useSound();
  const isFocus = useIsFocused();
  const translateY = useSharedValue(-500);
  useEffect(() => {
    if (isFocus) {
      playSound("bg", true);
    }
    console.log(isFocus);
  }, [isFocus]);
  useEffect(() => {
    translateY.value = withTiming(-200, { duration: 5000 });
  }, [isFocus]);
  const animatedStyle = useAnimatedStyle(() => {
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
  const [levelScreen,setLevelScreen] = useState(false);
  if(levelScreen){
    return <LevelScreen />
  }
  return (
    <ImageBackground
      source={require("../../assets/images/b2.png")}
      style={styles.background}
      resizeMode="cover"
      className="flex-1 justify-center items-center"
    >
      <Animated.Image
        source={require("../../assets/images/banner.png")}
        style={[styles.img, animatedStyle]}
      />

      {/* <LottieView></LottieView> */}
      <ScalePress style={styles.playBtnContainer} onPress={()=>setLevelScreen(true)}>
      {/* <ScalePress style={styles.playBtnContainer} onPress={()=>navigate('../candy-crush/LevelScreen')}> */}
        <Animated.Image
          source={require("../../assets/icons/play.png")}
          style={styles.playBtn}
        />
      </ScalePress>
    </ImageBackground>
  );
};

export default HomeScreen;

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.3,
    position: "absolute",
    bottom: "35%",
    resizeMode: "contain",
  },
  playBtn:{
    resizeMode:'contain',
    width:screenWidth*0.3,
    height:screenWidth*0.1,
  },
  playBtnContainer:{
    marginTop:200,
  }
});
