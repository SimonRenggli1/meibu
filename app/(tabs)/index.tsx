import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <ThemedText>Helo</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
