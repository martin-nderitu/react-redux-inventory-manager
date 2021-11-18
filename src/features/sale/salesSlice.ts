import {createAsyncThunk, createSlice, createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";
import {Sale} from "../../api/server";


export interface SaleState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const salesAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & SaleState = salesAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});


export const fetchSales = createAsyncThunk("sale/fetchSales", async (query: string = "") => {
    const response = await Sale.findAll(query);
    return response.data;
})

export const createSale = createAsyncThunk("sale/createSale", async (values: Body) => {
    const response = await Sale.create(values);
    return response.data;
});

export const cancelSale = createAsyncThunk("sale/cancelSale", async (saleId: string) => {
    const response = await Sale.cancel(saleId);
    return response.data;
});

export const fetchSale = createAsyncThunk("sale/fetchSale", async (saleId: string) => {
    const response = await Sale.find(saleId);
    return response.data;
});

export const updateSale = createAsyncThunk("sale/updateSale", async (values: Body) => {
    const response = await Sale.update(values);
    return response.data;
});

export const destroySale = createAsyncThunk("sale/destroySale", async (saleId: string) => {
    const response = await Sale.destroy(saleId);
    return response.data;
});


const saleSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchSales.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                const {sales, pagination} = action.payload;
                if (sales && pagination) {
                    state.pagination = pagination;
                    salesAdapter.setAll(state, sales);
                }
                state.status = "succeeded";
            })

            .addCase(createSale.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createSale.fulfilled, (state, action) => {
                const {sale} = action.payload;
                if (sale) {
                    salesAdapter.setOne(state, sale);
                }
                state.status = "succeeded";
            })

            .addCase(cancelSale.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(cancelSale.fulfilled, (state, action) => {
                state.status = "succeeded";
            })

            .addCase(fetchSale.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSale.fulfilled, (state, action) => {
                const {sale} = action.payload;
                if (sale) { salesAdapter.setOne(state, sale) }
                state.status = "succeeded";
            })

            .addCase(updateSale.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(updateSale.fulfilled, (state, action) => {
                const {sale} = action.payload;
                if (sale) { salesAdapter.setOne(state, sale) }
                state.status = "succeeded";
            })

            .addCase(destroySale.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroySale.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});

export default saleSlice.reducer;

export const {
    selectIds: selectSaleIds,
    selectEntities: selectSaleEntities,
    selectAll: selectAllSales,
    selectTotal: selectTotalSales,   // select total number of sales in state
    selectById: selectSaleById,
} = salesAdapter.getSelectors((state: RootState) => state.sales);

export const selectSalesPagination = (state: RootState) => state.sales.pagination;

export const selectSalesStatus = (state: RootState) => state.sales.status;
