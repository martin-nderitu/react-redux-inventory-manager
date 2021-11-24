import {Pagination} from "../../app/table";


interface CommonFields {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface DraftCategory {
    [k: string]: string;
    name: string;
    description?: string;
}

export interface Category extends DraftCategory, CommonFields {}

export interface DraftProduct {
    [k: string]: string | number;
    name: string;
    unitCost: string | number;
    unitPrice: string | number;
    store: string | number;
    counter: string | number;
    description?: string;
}

export interface Product extends DraftProduct, CommonFields {
    categoryId: string;
    readonly category?: Category,
}

export interface DraftPurchase {
    [k: string]: string | number;
    quantity: string | number;
    unitCost: string | number;
    unitPrice: string | number;
    location: string;
    productId: string;
    supplierId: string;
}

export interface Purchase extends DraftPurchase, CommonFields {
    readonly product?: Product;
    readonly supplier?: Supplier;
}

export interface DraftSupplier {
    [k: string]: string;
    name: string;
    phone: string;
    email?: string;
}

export interface Supplier extends DraftSupplier, CommonFields {}

export interface DraftSale {
    [k: string]: string | number;
    productId: string;
    quantity: string | number;
}

export interface Sale extends DraftSale, CommonFields {
    readonly product?: Product;
}

export interface DraftTransfer {
    productId: string;
    quantity: string | number;
    source: string;
    destination: string;
}

export interface Transfer extends DraftTransfer, CommonFields {
    readonly product: Product
}

interface RemoveFields {
    category?: never;
    categories?: never;
    product?: never;
    products?: never;
    purchase?: never;
    purchases?: never;
    sale?: never;
    sales?: never;
    supplier?: never;
    suppliers?: never;
    transfer?: never;
    transfers?: never;
}

interface RemoveErrors {
    invalidData?: never;
    error?: never;
}

export interface Message {
    message: string;
    error?: never;
    invalidData?: never;
}

export interface FormErrors extends RemoveFields {
    invalidData: { [k: string]: string }
    message?: never;
    error?: never;
}

export interface Error extends RemoveFields {
    error: string;
    message?: never;
    invalidData?: never;
    pagination?: never;
}

interface ItemsList { pagination: Pagination }

export interface CategoryState extends RemoveErrors {
    category: Category;
}

export interface Categories extends ItemsList {
    categories: Category[];
    error?: never;
}

export interface ProductState extends RemoveErrors {
    product: Product;
    invalidData?: never;
    error?: never;
}

export interface Products extends ItemsList {
    products: Product[];
    error?: never;
}

export interface PurchaseState extends RemoveErrors {
    purchase: Purchase;
}

export interface Purchases extends ItemsList {
    purchases: Purchase[];
    error?: never;
}

export interface SaleState extends RemoveErrors {
    sale: Sale;
}

export interface Sales extends ItemsList {
    sales: Sale[];
    error?: never;
}

export interface SupplierState extends RemoveErrors {
    supplier: Supplier;
}

export interface Suppliers extends ItemsList {
    suppliers: Supplier[];
    error?: never;
}

export interface TransferState extends RemoveErrors {
    transfer: Transfer;
}

export interface Transfers extends ItemsList {
    transfers: Transfer[];
    error?: never;
}

