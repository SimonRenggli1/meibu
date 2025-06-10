import { Category } from '@/components/enums/category';

export class CategoryHelper {
    static getAllCategories(): Category[] {
        return Object.values(Category) as Category[];
    }

    static getIconName(category: Category): string {
        switch (category) {
            case Category.FOOD:
                return 'food';
            case Category.TRANSPORT:
                return 'car';
            case Category.SHOPPING:
                return 'shopping';
            case Category.ENTERTAINMENT:
                return 'film';
            case Category.UTILITIES:
                return 'flash';
            case Category.OTHER:
                return 'dots-horizontal';
            default:
                return 'tag';
        }
    }
}
