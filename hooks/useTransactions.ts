// hooks/useTransactions.ts
import {useState, useEffect, useCallback} from 'react';
import { getTransactions } from '@/components/Transactions';
import { Transaction } from '@/components/objects/Transaction';
import { Category } from '@/components/enums/category';
import { TransactionType } from '@/components/enums/transactionType';
import {useFocusEffect} from "expo-router";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const loadTransactions = async () => {
        const loadedTransactions = await getTransactions();
        setTransactions(loadedTransactions);
    };

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );

    const getTransactionsTotalByCategory = (category: Category) => {
        return transactions
            .filter(t => t.category === category && t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getTotalTransactions = () => {
        return transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getTotalIncome = () => {
        return transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return {
        transactions,
        getTransactionsTotalByCategory,
        getTotalTransactions,
        getTotalIncome,
    };
};
