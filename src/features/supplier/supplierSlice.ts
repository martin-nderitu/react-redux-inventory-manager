import {createAsyncThunk, createSlice, createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";
import {Supplier} from "../../api/server";


export interface SupplierState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const suppliersAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & SupplierState = suppliersAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});


export const fetchSuppliers = createAsyncThunk("supplier/fetchSuppliers", async (query: string = "") => {
    const response = await Supplier.findAll(query);
    return response.data;
})

export const createSupplier = createAsyncThunk("supplier/createSupplier", async (values: Body) => {
    const response = await Supplier.create(values);
    return response.data;
});

export const fetchSupplier = createAsyncThunk("supplier/fetchSupplier", async (supplierId: string) => {
    const response = await Supplier.find(supplierId);
    return response.data;
});

export const updateSupplier = createAsyncThunk("supplier/updateSupplier", async (values: Body) => {
    const response = await Supplier.update(values);
    return response.data;
});

export const destroySupplier = createAsyncThunk("supplier/destroySupplier", async (supplierId: string) => {
    const response = await Supplier.destroy(supplierId);
    return response.data;
});


const supplierSlice = createSlice({
    name: "suppliers",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchSuppliers.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                const {suppliers, pagination} = action.payload;
                if (suppliers && pagination) {
                    state.pagination = pagination;
                    suppliersAdapter.setAll(state, suppliers);
                }
                state.status = "succeeded";
            })

            .addCase(createSupplier.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                const {supplier} = action.payload;
                if (supplier) {
                    suppliersAdapter.setOne(state, supplier);
                }
                state.status = "succeeded";
            })

            .addCase(fetchSupplier.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSupplier.fulfilled, (state, action) => {
                const {supplier} = action.payload;
                if (supplier) { suppliersAdapter.setOne(state, supplier) }
                state.status = "succeeded";
            })

            .addCase(updateSupplier.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                const {supplier} = action.payload;
                if (supplier) { suppliersAdapter.setOne(state, supplier) }
                state.status = "succeeded";
            })

            .addCase(destroySupplier.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroySupplier.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});

export default supplierSlice.reducer;

export const {
    selectIds: selectSupplierIds,
    selectEntities: selectSupplierEntities,
    selectAll: selectAllSuppliers,
    selectTotal: selectTotalSuppliers,   // select total number of suppliers in state
    selectById: selectSupplierById,
} = suppliersAdapter.getSelectors((state: RootState) => state.suppliers);

export const selectSuppliersPagination = (state: RootState) => state.suppliers.pagination;

export const selectSuppliersStatus = (state: RootState) => state.suppliers.status;
