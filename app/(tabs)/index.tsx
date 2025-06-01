import {StyleSheet, View} from "react-native";
import {Text} from '@rneui/themed';

export default function HomeScreen() {
    return (
        <View style={[styles.container]}>
            <View style={styles.title}>
                <Text h1 style={[styles.text]}>
                    Meibu
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 5
    },
    text: {
        color: '#fff',
        fontWeight: "600"
    },
    title: {
        padding: 20,
        width: '100%',
        alignItems: "center",
        justifyContent: "flex-start",
    }
});
