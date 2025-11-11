import React from "react";
import { View } from "react-native";
import { players } from "../../../../data";
import Player from "./Player";

const index = () => {
  // const players = players
  return (
    <View>
      {players.map(
        (player: { icon: string; id: React.Key | null | undefined }) => (
          <Player label={player.icon} key={player.id} color={'#fcf'} />
        )
      )}
    </View>
  );
};

export default index;
