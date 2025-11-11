import TimerWave from '@/components/timer-wave';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenHeight, screenWidth } from '../ui/Footer';

interface GameHeaderProps {
    timer:number;
    collectedCandies:number;
    totalCount:number;
    moves:number;
}
const GameHeader: React.FC<GameHeaderProps> = ({ timer, collectedCandies, totalCount, moves }: GameHeaderProps) => {
    const moveView = moves > 0 ? (
        <Text style={styles.timeText}>
            {moves} Moves Left
        </Text>
    ) : null;
    const timeView = timer > 0 ? (
        <Text style={styles.timeText}>
            <TimerWave time={timer}/> {format(timer)}
        </Text>
    ) : null;
    const timeDisplay = timer > 0 ? moveView : timeView;
  return (
    <View style={styles.container}>
        <SafeAreaView/>
        <Image source={require('../../../../assets/icons/hangrope.png')} style={styles.image}/>
        <ImageBackground source={require('../../../../assets/images/lines.jpg')} style={styles.lines}>
        <View style={styles.subContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.candiesText}>🍬 {collectedCandies} / 
                    <Text style={styles.totalCandiesText}> {totalCount} </Text>
                </Text>
                </View>
                <View style={styles.timeContainer}>
                    {timeDisplay}
                </View>
        </View>
        </ImageBackground>
    </View>
  )
}

export default GameHeader

const styles = StyleSheet.create({
    container:{
        height:screenHeight*0.15,
        width:screenWidth,
    },
    image:{
        width:screenWidth,
        height:screenHeight*0.06,
        resizeMode:'contain',
        position:'absolute',
        zIndex:2,
        alignSelf:'center',
        top:screenHeight*0.002,
    },
    lines:{
        padding:5,
        borderRadius:35,
        resizeMode:'contain',
        overflow:'hidden',
        margin:screenHeight*0.03,
        marginTop:-screenWidth*0.04,
    },
    subContainer:{
        backgroundColor:'#EDC180',
        padding:screenWidth*0.02,
        borderRadius:screenHeight*0.45,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        shadowColor:'#000',
        shadowOffset:{width:4,height:16},
        shadowOpacity:0.3,
        shadowRadius:5,
        elevation:4,
        cursor:'pointer'
    },
    textContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#c29781',
        padding:8,
        paddingHorizontal:10,
        borderRadius:45,
        justifyContent:'center',
        cursor:'pointer'
    },
    candiesText:{
        fontSize:screenWidth*0.05,
        fontFamily:Fonts.mono,
        color:'#3A0E4C',
    },
    totalCandiesText:{
        fontFamily:Fonts.mono,
        fontSize:screenWidth*0.05,
        color:'#3A0E4C'
    },
    timeContainer:{
        backgroundColor:'#c29781',
        padding:8,
        alignItems:'center',
        paddingHorizontal:20,
        borderRadius:45,
        justifyContent:'center',
        cursor:'pointer'
    },
    timeText:{
        fontSize:screenWidth*0.05,
        fontFamily:Fonts.mono,
        color:'#5B2333',
    }
})

const format = (time:number)=>{
    const ss = time>1000 ? parseInt(String(time/1000))%60 : 0;
    const min = time > (60*1000) ? parseInt(String(time/(60*1000)))%60 : 0;
    return `${String(min).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
}
