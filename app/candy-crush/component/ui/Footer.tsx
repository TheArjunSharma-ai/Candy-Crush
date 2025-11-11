import { Fonts } from '@/constants/theme'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('footer click')}>
        <Text style={styles.text2}>Copy right @</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Developed by Arjun Sharma</Text>
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent', // or any footer background
  },
  text: {
    fontFamily: Fonts.serif,
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    color: '#ffffff08',
  },
  text2: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    color: '#ffffff04',
  },
})
export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;