import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import purchaseReducer from "../features/purchase/purchaseSlice";
import saleReducer from "../features/sale/salesSlice";
import suppliersReducer from "../features/supplier/supplierSlice";
import transferReducer from "../features/transfer/transferSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
    purchases: purchaseReducer,
    sales: saleReducer,
    suppliers: suppliersReducer,
    transfers: transferReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
