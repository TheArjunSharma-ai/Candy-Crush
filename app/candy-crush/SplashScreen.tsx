import React from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';

// import { NavigationProp, useNavigation } from '@react-navigation/native';


type RootStackParamList = {
  HomeScreen: undefined;
  // add other screens here if needed
};

const SplashScreen = () => {

  //  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // useEffect(() => {
  //   const timeOutId = setTimeout(() => {
  //     navigation.navigate('HomeScreen');
  //   }, 2000); // 2 seconds
  //   return () => clearTimeout(timeOutId);
  // }, [navigation]);

  return (
    <ImageBackground source={require('../../assets/images/candy-bg.png')} style={styles.background} resizeMode='cover' className='flex-1 justify-center items-center'>
      <Image source={require('../../assets/images/candy-logo1.png')} style={{ width: 200, height: 200 }} />
    </ImageBackground>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
