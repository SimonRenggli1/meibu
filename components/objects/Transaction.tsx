import uuid from 'react-native-uuid';
import { category } from "@/components/enums/category";
import { transactionType } from "@/components/enums/transactionType";

export class Transaction {
    id: string;
    title: string;
    amount: number;
    category: category;
    type: transactionType;
    date: string;

    constructor(
        title: string,
        amount: number,
        categoryValue: category,
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
