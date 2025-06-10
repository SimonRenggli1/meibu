import React, {useState} from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Button, ButtonGroup, Input, Switch, Text} from "@rneui/themed";
import {Picker} from "@react-native-picker/picker";
import {storeTransaction} from "@/components/Transactions";
import {transactionType} from "@/components/enums/transactionType";
import {category} from "@/components/enums/category";
import {Transaction} from "@/components/objects/Transaction";
import {getAllRecurringIntervals, RecurringInterval} from "@/components/enums/reacurringInterval";
import {useRouter} from "expo-router";

export default function AddTransactionScreen() {
    const categories = category.getAllCategories();
    const types = transactionType.getAllTransactionTypes();
    const intervals = getAllRecurringIntervals();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [typeIndex, setTypeIndex] = useState(0);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>(RecurringInterval.MONTHLY);

    const router = useRouter();

    const resetForm = () => {
        setTitle("");
        setAmount("");
        setSelectedCategory(categories[0]);
        setTypeIndex(0);
        setIsRecurring(false);
        setRecurringInterval(RecurringInterval.MONTHLY);
    };

    const saveTransaction = async () => {
        if (!title || !amount || isNaN(parseFloat(amount)) || !selectedCategory) {
            Alert.alert("Bitte fülle alle Felder korrekt aus");
            return;
        }

        try {
            const transaction = new Transaction(
                title,
                parseFloat(amount),
                selectedCategory,
                types[typeIndex],
            );
            await storeTransaction(transaction);
            resetForm();
            router.push('/')
        } catch (e) {
            console.error("Speicherfehler:", e);
            Alert.alert("Fehler", "Transaktion konnte nicht hinzugefügt werden");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                        <Text h4 style={styles.heading}>Neue Transaktion</Text>

                        <ButtonGroup
                            buttons={types}
                            selectedIndex={typeIndex}
                            onPress={setTypeIndex}
                            containerStyle={styles.buttonGroup}
                        />

                        <Input
                            placeholder="Name"
                            value={title}
                            onChangeText={setTitle}
                            inputStyle={styles.inputText}
                        />

                        <Input
                            placeholder="Betrag"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            inputStyle={styles.inputText}
                        />

                        <Text style={styles.label}>Kategorie</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={setSelectedCategory}
                                style={styles.picker}
                            >
                                {categories.map((cat) => (
                                    <Picker.Item key={cat} label={cat} value={cat}/>
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.recurringContainer}>
                            <Text style={styles.label}>Wiederkehrend</Text>
                            <Switch
                                value={isRecurring}
                                onValueChange={setIsRecurring}
                            />
                        </View>

                        {isRecurring && (
                            <View style={styles.pickerContainer}>
                                <Text style={styles.label}>Intervall</Text>
                                <Picker
                                    selectedValue={recurringInterval}
                                    onValueChange={(value) => setRecurringInterval(value)}
                                    style={styles.picker}
                                >
                                    {intervals.map((interval) => (
                                        <Picker.Item
                                            key={interval.value}
                                            label={interval.label}
                                            value={interval.value}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        )}

                        <Button
                            title="Transaktion speichern"
                            onPress={saveTransaction}
                            buttonStyle={styles.saveButton}
                        />
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16
    },
    heading: {
        marginBottom: 20,
        textAlign: "center"
    },
    buttonGroup: {
        marginBottom: 20
    },
    label: {
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 5
    },
    inputText: {
        fontSize: 16
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 20,
    },
    recurringContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 8,
        paddingVertical: 12
    },
    picker: {
        color: "#000",
    }
});
