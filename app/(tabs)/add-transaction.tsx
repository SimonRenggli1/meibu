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
import {Button, ButtonGroup, Divider, Input, Switch, Text} from "@rneui/themed";
import {Picker} from "@react-native-picker/picker";
import {storeTransaction} from "@/components/Transactions";
import {transactionType} from "@/components/enums/transactionType";
import {category, Category} from "@/components/enums/category";
import {Transaction} from "@/components/objects/Transaction";
import {getAllRecurringIntervals, RecurringInterval} from "@/components/enums/reacurringInterval";
import {useRouter} from "expo-router";

import {useBudgetContext} from "@/contexts/BudgetContext";

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

    const {savingGoal, setSavingGoal} = useBudgetContext();
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
                isRecurring,
                isRecurring ? recurringInterval : RecurringInterval.NONE
            );
            await storeTransaction(transaction);

            if (selectedCategory === Category.SAVINGS) {
                setSavingGoal({
                    ...savingGoal,
                    saved: (savingGoal?.saved ?? 0) + Math.abs(parseFloat(amount)),
                    amount: savingGoal?.amount ?? 0,
                    targetDate: savingGoal?.targetDate,
                });
            }

            resetForm();
            router.push('/');
        } catch (e) {
            console.error("Speicherfehler:", e);
            Alert.alert("Fehler", "Transaktion konnte nicht hinzugefügt werden");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={100}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <Text h4 style={styles.title}>Neue Transaktion</Text>
                            <Divider style={styles.divider}/>

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
                                    itemStyle={{color: "black"}}
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
                                    trackColor={{false: "#ccc", true: "#333C4D"}}
                                    thumbColor={isRecurring ? "#fff" : "#fff"}
                                />
                            </View>

                            {isRecurring && (
                                <View>
                                    <Picker
                                        selectedValue={recurringInterval}
                                        onValueChange={(value) => setRecurringInterval(value)}
                                        itemStyle={{color: "black"}}
                                    >
                                        {intervals.map((interval) => (
                                            <Picker.Item key={interval.value} label={interval.label}
                                                         value={interval.value}/>
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        marginVertical: 16,
        textAlign: 'center',
        color: '#333',
    },
    buttonGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5
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
        marginVertical: 10,
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 8,
        paddingVertical: 12
    },
    picker: {
        color: "#000"
    },
    divider: {
        marginBottom: 8,
    },
});
