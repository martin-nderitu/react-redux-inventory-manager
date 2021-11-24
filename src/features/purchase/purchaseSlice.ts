import {emptySplitApi} from "../api/apiSlice";
import {Purchases, PurchaseState, DraftPurchase, Error, FormErrors, Message} from "../api";

export const purchaseApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getPurchases: builder.query<Purchases | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/purchases${query}`: "/purchases",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.purchases) {
                    return ["Purchase", ...result.purchases.map(({ id }) => ({type: "Purchase" as const, id}))]
                } else {
                    return ["Purchase"]
                }
            }
        }),
        getPurchase: builder.query<PurchaseState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/purchases/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Purchase", id: arg }]
        }),
        addNewPurchase: builder.mutation<PurchaseState | FormErrors | Error, DraftPurchase>({
            query: (category) => ({
                url: "/purchases",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Purchase"]
        }),
        editPurchase: builder.mutation<PurchaseState | FormErrors | Error, DraftPurchase>({
            query: (category) => ({
                url: "/purchases",
                method: "PATCH",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Purchase", id: arg.id }]
        }),
        destroyPurchase: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/purchases/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Purchase"]
        })
    })
})

export const {
    useGetPurchasesQuery,
    useGetPurchaseQuery,
    useAddNewPurchaseMutation,
    useEditPurchaseMutation,
    useDestroyPurchaseMutation,
} = purchaseApi;