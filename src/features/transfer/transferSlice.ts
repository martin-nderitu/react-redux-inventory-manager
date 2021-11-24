import {emptySplitApi} from "../api/apiSlice";
import {Transfers, TransferState, DraftTransfer, Error, FormErrors, Message} from "../api";

export const transferApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransfers: builder.query<Transfers | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/transfers${query}`: "/transfers",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.transfers) {
                    return ["Transfer", ...result.transfers.map(({ id }) => ({type: "Transfer" as const, id}))]
                } else {
                    return ["Transfer"]
                }
            }
        }),
        getTransfer: builder.query<TransferState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/transfers/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Transfer", id: arg }]
        }),
        addNewTransfer: builder.mutation<TransferState | FormErrors | Error, DraftTransfer>({
            query: (category) => ({
                url: "/transfers",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Transfer"]
        }),
        destroyTransfer: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/transfers/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Transfer"]
        })
    })
})

export const {
    useGetTransfersQuery,
    useGetTransferQuery,
    useAddNewTransferMutation,
    useDestroyTransferMutation,
} = transferApi;