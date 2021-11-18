export interface ICategory {
    [k: string]: string;
    id: string;
    name: string;
    description?: string;
}

export interface IProduct {
    [k: string]: string | number | Category | undefined;
    id: string;
    name: string;
    unitCost: string | number;
    unitPrice: string | number;
    store: string | number;
    counter: string | number;
    description?: string;
    categoryId: string;
    category?: Category,
}

export interface IPurchase {
    [k: string]: string | number | Supplier | Product | undefined;
    id: string;
    quantity: string | number;
    unitCost: string | number;
    unitPrice: string | number;
    location: string;
    productId: string;
    supplierId: string;
    product?: Product;
    supplier?: Supplier;
}

export interface ISupplier {
    [k: string]: string;
    id: string;
    name: string;
    phone: string;
    email?: string;
}

export interface ISale {
    [k: string]: string | number | Product;
    id: string;
    productId: string;
    quantity: string | number;
    product?: Product;
}