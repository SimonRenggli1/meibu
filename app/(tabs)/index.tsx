import {View} from "react-native";
import {Text} from '@rneui/themed';

export default function HomeScreen() {
    return (
        // <View style={[styles.container]}>
        <View className="flex-1 p-5">
            <View className="p-20 w-full items-center justi">
                <Text h1 className="text-black font-normal">
                    Meibu
                </Text>
            </View>
        </View>
    );
}
