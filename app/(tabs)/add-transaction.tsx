import React, {useState} from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Button, ButtonGroup, Input, Text} from "@rneui/themed";
import {Picker} from "@react-native-picker/picker";
import {storeTransaction} from '@/components/Transactions';
import {transactionType} from "@/components/enums/transactionType";
import {category} from "@/components/enums/category";
import {Transaction} from "@/components/objects/Transaction";

export default function AddTransactionScreen() {
    const categories = category.getAllCategories();
    const types = transactionType.getAllTransactionTypes();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [typeIndex, setTypeIndex] = useState(0);

    const resetForm = () => {
        setTitle("");
        setAmount("");
        setSelectedCategory(categories[0]);
        setTypeIndex(0);
    };

    const saveTransaction = async () => {
        if (!title || !amount || isNaN(parseFloat(amount)) || !selectedCategory) {
            Alert.alert("Bitte fülle alle Felder korrekt aus");
            return;
        }

        try {
            const transaction = new Transaction(title, parseFloat(amount), selectedCategory as category, types[typeIndex] as transactionType)
            await storeTransaction(transaction);

            Alert.alert("Erfolg", "Transaktion hinzugefügt");
            resetForm();
        } catch (e) {
            console.error("Speicherfehler:", e);
            Alert.alert("Fehler", "Transaktion konnte nicht hinzugefügt werden");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            <ButtonGroup
                                buttons={types}
                                selectedIndex={typeIndex}
                                onPress={setTypeIndex}
                                containerStyle={styles.buttonGroup}
                            />

                            <Input placeholder="Name" value={title} onChangeText={setTitle}/>
                            <Input
                                placeholder="Preis"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />

                            <Text style={styles.label}>Kategorie</Text>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={setSelectedCategory}
                                style={styles.picker}
                            >
                                {categories.map((cat) => (
                                    <Picker.Item key={cat} label={cat} value={cat}/>
                                ))}
                            </Picker>
                            <Button title="Transaktion speichern" onPress={saveTransaction}/>
                        </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

let styles = StyleSheet.create({
    container: {
        flex: 1, padding: 16,
    }, buttonGroup: {
        marginBottom: 16,
    }, label: {
        marginBottom: 8, fontWeight: "bold",
    }, picker: {
        marginBottom: 16,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
})