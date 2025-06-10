import uuid from 'react-native-uuid';
import { Category } from "@/components/enums/category";
import { transactionType } from "@/components/enums/transactionType";

export class Transaction {
    id: string;
    title: string;
    amount: number;
    category: Category;
    type: transactionType;
    date: string;

    constructor(
        title: string,
        amount: number,
        categoryValue: Category,
        typeValue: transactionType
    ) {
        this.id = uuid.v4() as string;
        this.title = title;
        this.amount = amount;
        this.category = categoryValue;
        this.type = typeValue;
        this.date = new Date().toISOString();
    }
}
