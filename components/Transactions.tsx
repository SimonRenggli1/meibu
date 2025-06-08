import AsyncStorage from "@react-native-async-storage/async-storage";
import {Transaction} from "@/components/objects/Transaction";

const storeTransaction = async (transaction: Transaction) => {
    try {
        const jsonValue = JSON.stringify(transaction);
        await AsyncStorage.setItem('transactions', jsonValue);
    } catch (e) {
        console.error(e);
    }
};

const getTransactions = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('transactions');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
};

export { storeTransaction, getTransactions };