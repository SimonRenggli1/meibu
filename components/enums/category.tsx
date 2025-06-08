export enum Category {
    FOOD = 'Food',
    TRANSPORT = 'Transport',
    SHOPPING = 'Shopping',
    ENTERTAINMENT = 'Entertainment',
    UTILITIES = 'Utilities',
    OTHER = 'Other',
}

export class category {
    static getAllCategories(): string[] {
        return Object.values(Category);
    }
}
