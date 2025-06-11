// hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { getTransactions } from '@/components/Transactions';
import { Transaction } from '@/components/objects/Transaction';
import { Category } from '@/components/enums/category';
import { TransactionType } from '@/components/enums/transactionType';

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const loadTransactions = async () => {
            const loadedTransactions = await getTransactions();
            setTransactions(loadedTransactions);
        };
        loadTransactions();
    }, []);

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
