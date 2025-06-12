import AsyncStorage from "@react-native-async-storage/async-storage";
import {Transaction} from "@/components/objects/Transaction";

const storeTransaction = async (transaction: Transaction) => {
    try {
        const existing = await getTransactions();
        const transactions: Transaction[] = Array.isArray(existing) ? existing : [];

        transactions.push(transaction);

        const jsonValue = JSON.stringify(transactions);
        await AsyncStorage.setItem('transactions', jsonValue);
    } catch (e) {
        console.error(e);
    }
};

const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem('transactions');
        const parsed = jsonValue ? JSON.parse(jsonValue) : [];

        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const deleteTransaction = async (id: string) => {
    const stored = await getTransactions();
    const filtered = stored.filter(t => t.id !== id);
    await AsyncStorage.setItem("transactions", JSON.stringify(filtered));
};

export { storeTransaction, getTransactions, deleteTransaction };