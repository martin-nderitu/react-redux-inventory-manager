import {emptySplitApi} from "../api/apiSlice";
import {Suppliers, SupplierState, DraftSupplier, Error, FormErrors, Message} from "../api";

export const supplierApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query<Suppliers | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/suppliers${query}`: "/suppliers",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.suppliers) {
                    return ["Supplier", ...result.suppliers.map(({ id }) => ({type: "Supplier" as const, id}))]
                } else {
                    return ["Supplier"]
                }
            }
        }),
        getSupplier: builder.query<SupplierState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/suppliers/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Supplier", id: arg }]
        }),
        addNewSupplier: builder.mutation<SupplierState | FormErrors | Error, DraftSupplier>({
            query: (category) => ({
                url: "/suppliers",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Supplier"]
        }),
        editSupplier: builder.mutation<SupplierState | FormErrors | Error, DraftSupplier>({
            query: (category) => ({
                url: "/suppliers",
                method: "PATCH",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Supplier", id: arg.id }]
        }),
        destroySupplier: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/suppliers/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Supplier"]
        })
    })
})

export const {
    useGetSuppliersQuery,
    useGetSupplierQuery,
    useAddNewSupplierMutation,
    useEditSupplierMutation,
    useDestroySupplierMutation,
} = supplierApi;