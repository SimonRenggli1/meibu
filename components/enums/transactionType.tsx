export enum TransactionType {
    EXPENSE = 'Expense',
    INCOME = 'Income',
}

export class transactionType {
    static getAllTransactionTypes(): string[] {
        return Object.values(TransactionType);
    }
}