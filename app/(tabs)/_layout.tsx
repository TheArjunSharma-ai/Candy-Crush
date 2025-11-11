import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      headerShown: false,
      tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        title: "HomeScreen",
    tabBarIcon: ({ color }) => (
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 50,
          padding: 6,
          textAlign: "center",
        }}
      >
        {String.fromCharCode(2384)}
      </Text>
    ),
      }}
      />
      <Tabs.Screen
      name="explore"
      options={{
        title: "Explore",
        tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="paperplane.fill" color={color} />
        ),
      }}
      />
    </Tabs>
  );
}
