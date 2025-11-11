import React from 'react'
import { Text, View } from 'react-native'
import FourBoard from './FourBoard'
import { players } from '@/data'

const index = () => {
  const activePlayers = players.filter(player => player.isActive);
  
  return (
    <View>
      <Text>index</Text>
      <View style={{ alignItems: "center", justifyContent: "center", margin: 20,padding: 20 }}><FourBoard players={activePlayers} /></View>
    </View>
  )
}

export default index
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
