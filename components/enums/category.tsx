export enum Category {
    SAVINGS = 'Savings',
    FOOD = 'Food',
    TRANSPORT = 'Transport',
    SHOPPING = 'Shopping',
    ENTERTAINMENT = 'Entertainment',
    UTILITIES = 'Utilities',
    OTHER = 'Other',
}

export class category {
    static getAllCategories(): Category[] {
        return Object.values(Category);
    }
}
