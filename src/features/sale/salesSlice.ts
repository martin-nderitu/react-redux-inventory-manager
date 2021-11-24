import {emptySplitApi} from "../api/apiSlice";
import {Sales, SaleState, DraftSale, Error, FormErrors, Message} from "../api";

export const saleApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query<Sales | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/sales${query}`: "/sales",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.sales) {
                    return ["Sale", ...result.sales.map(({ id }) => ({type: "Sale" as const, id}))]
                } else {
                    return ["Sale"]
                }
            }
        }),
        getSale: builder.query<SaleState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/sales/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Sale", id: arg }]
        }),
        addNewSale: builder.mutation<SaleState | FormErrors | Error, DraftSale>({
            query: (category) => ({
                url: "/sales",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Sale"]
        }),
        editSale: builder.mutation<SaleState | FormErrors | Error, DraftSale>({
            query: (category) => ({
                url: "/sales",
                method: "PATCH",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Sale", id: arg.id }]
        }),
        cancelSale: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/sales/${id}/cancel`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Sale"]
        }),
        destroySale: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/sales/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Sale"]
        })
    })
})

export const {
    useGetSalesQuery,
    useGetSaleQuery,
    useAddNewSaleMutation,
    useEditSaleMutation,
    useCancelSaleMutation,
    useDestroySaleMutation,
} = saleApi;