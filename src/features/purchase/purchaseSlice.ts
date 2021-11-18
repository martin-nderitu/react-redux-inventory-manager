import {createAsyncThunk, createSlice, createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";
import {Purchase} from "../../api/server";


export interface PurchaseState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const purchasesAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & PurchaseState = purchasesAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});


export const fetchPurchases = createAsyncThunk("purchase/fetchPurchases", async (query: string = "") => {
    const response = await Purchase.findAll(query);
    return response.data;
})

export const createPurchase = createAsyncThunk("purchase/createPurchase", async (values: Body) => {
    const response = await Purchase.create(values);
    return response.data;
});

export const fetchPurchase = createAsyncThunk("purchase/fetchPurchase", async (purchaseId: string) => {
    const response = await Purchase.find(purchaseId);
    return response.data;
});

export const updatePurchase = createAsyncThunk("purchase/updatePurchase", async (values: Body) => {
    const response = await Purchase.update(values);
    return response.data;
});

export const destroyPurchase = createAsyncThunk("purchase/destroyPurchase", async (purchaseId: string) => {
    const response = await Purchase.destroy(purchaseId);
    return response.data;
});


const purchaseSlice = createSlice({
    name: "purchases",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPurchases.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchPurchases.fulfilled, (state, action) => {
                const {purchases, pagination} = action.payload;
                if (purchases && pagination) {
                    state.pagination = pagination;
                    purchasesAdapter.setAll(state, purchases);
                }
                state.status = "succeeded";
            })

            .addCase(createPurchase.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createPurchase.fulfilled, (state, action) => {
                const {purchase} = action.payload;
                if (purchase) {
                    purchasesAdapter.setOne(state, purchase);
                }
                state.status = "succeeded";
            })

            .addCase(fetchPurchase.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchPurchase.fulfilled, (state, action) => {
                const {purchase} = action.payload;
                if (purchase) { purchasesAdapter.setOne(state, purchase) }
                state.status = "succeeded";
            })

            .addCase(updatePurchase.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(updatePurchase.fulfilled, (state, action) => {
                const {purchase} = action.payload;
                if (purchase) { purchasesAdapter.setOne(state, purchase) }
                state.status = "succeeded";
            })

            .addCase(destroyPurchase.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroyPurchase.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});


export default purchaseSlice.reducer;

export const {
    selectIds: selectPurchaseIds,
    selectEntities: selectPurchaseEntities,
    selectAll: selectAllPurchases,
    selectTotal: selectTotalPurchases,   // select total number of purchases in state
    selectById: selectPurchaseById,
} = purchasesAdapter.getSelectors((state: RootState) => state.purchases);

export const selectPurchasesPagination = (state: RootState) => state.purchases.pagination;

export const selectPurchasesStatus = (state: RootState) => state.purchases.status;

