import {Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {useAuth} from "@/contexts/AuthContext";
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from 'expo-local-authentication';
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function LockScreen() {
    const [code, setCode] = useState<number[]>([]);
    const codeLength = Array(6).fill(0);
    const router = useRouter();
    const {authenticate} = useAuth();
    const VALID_PIN = '111111';

    useEffect(() => {
        if (code.length === 6) {
            if (code.join('') === VALID_PIN) {
                authenticate();
                router.replace("/");
                setCode([]);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setCode([]);
            }
        }
    }, [authenticate, code, router])

    const onNumberPress = async (number: number) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    }

    const onBackspacePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    }

    const onBiometricPress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const {success} = await LocalAuthentication.authenticateAsync();

        if (success) {
            authenticate();
            router.replace("/");
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };


    return (
        <SafeAreaView>
            <Text style={styles.header}>PIN eingeben</Text>

            <View style={styles.codeView}>
                {codeLength.map((_, i) => (
                    <View key={i}
                          style={[
                              styles.codeEmpty,
                              {
                                  backgroundColor: code[i] !== undefined ? 'black' : 'lightgrey',
                              }
                          ]}
                    />
                ))}
            </View>

            <View style={styles.numbersView}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {[1, 2, 3].map((number) => (
                        <TouchableOpacity style={styles.numbersTouch} key={number}
                                          onPress={() => onNumberPress(number)}>
                            <Text style={styles.number}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {[4, 5, 6].map((number) => (
                        <TouchableOpacity style={styles.numbersTouch} key={number}
                                          onPress={() => onNumberPress(number)}>
                            <Text style={styles.number}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {[7, 8, 9].map((number) => (
                        <TouchableOpacity style={styles.numbersTouch} key={number}
                                          onPress={() => onNumberPress(number)}>
                            <Text style={styles.number}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.numbersTouch} onPress={onBiometricPress}>
                        <MaterialCommunityIcons name="face-recognition" size={26} color="black"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.numbersTouch} onPress={() => onNumberPress(0)}>
                        <Text style={styles.number}>0</Text>
                    </TouchableOpacity>

                    <View style={{minWidth: 30}}>
                        <TouchableOpacity style={styles.numbersTouch} onPress={onBackspacePress}>
                            <MaterialCommunityIcons name="backspace" size={26} color="black"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginHorizontal: 80,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 80,
    },
    codeView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        marginVertical: 80,
    },
    codeEmpty: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    numbersView: {
        marginHorizontal: 50,
        gap: 20
    },
    number: {
        fontSize: 32,
    },
    numbersTouch: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    }
});