import {createAsyncThunk, createSlice, createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";
import {Transfer} from "../../api/server";


export interface TransferState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const transfersAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & TransferState = transfersAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});


export const fetchTransfers = createAsyncThunk("transfer/fetchTransfers", async (query: string = "") => {
    const response = await Transfer.findAll(query);
    return response.data;
})

export const createTransfer = createAsyncThunk("transfer/createTransfer", async (values: Body) => {
    const response = await Transfer.create(values);
    return response.data;
});

export const fetchTransfer = createAsyncThunk("transfer/fetchTransfer", async (transferId: string) => {
    const response = await Transfer.find(transferId);
    return response.data;
});

export const destroyTransfer = createAsyncThunk("transfer/destroyTransfer", async (transferId: string) => {
    const response = await Transfer.destroy(transferId);
    return response.data;
});


const transferSlice = createSlice({
    name: "transfers",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchTransfers.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchTransfers.fulfilled, (state, action) => {
                const {transfers, pagination} = action.payload;
                if (transfers && pagination) {
                    state.pagination = pagination;
                    transfersAdapter.setAll(state, transfers);
                }
                state.status = "succeeded";
            })

            .addCase(createTransfer.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createTransfer.fulfilled, (state, action) => {
                const {transfer} = action.payload;
                if (transfer) {
                    transfersAdapter.setOne(state, transfer);
                }
                state.status = "succeeded";
            })

            .addCase(fetchTransfer.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchTransfer.fulfilled, (state, action) => {
                const {transfer} = action.payload;
                if (transfer) { transfersAdapter.setOne(state, transfer) }
                state.status = "succeeded";
            })

            .addCase(destroyTransfer.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroyTransfer.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});

export default transferSlice.reducer;

export const {
    selectIds: selectTransferIds,
    selectEntities: selectTransferEntities,
    selectAll: selectAllTransfers,
    selectTotal: selectTotalTransfers,   // select total number of transfers in state
    selectById: selectTransferById,
} = transfersAdapter.getSelectors((state: RootState) => state.transfers);

export const selectTransfersPagination = (state: RootState) => state.transfers.pagination;

export const selectTransfersStatus = (state: RootState) => state.transfers.status;
