import { Link, Stack } from 'expo-router';
import {View} from 'react-native';
import {Text} from "@rneui/themed";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center content-center p-20">
        <Text h2>This screen does not exist.</Text>
        <Link href="/" className="mt-14 py-14">
          <Text h2>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
