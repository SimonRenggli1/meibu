import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
import AntDesign from "@expo/vector-icons/AntDesign";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-transaction"
        options={{
          title: "Add Transaction",
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
