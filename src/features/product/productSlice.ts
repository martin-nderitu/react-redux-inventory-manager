import {emptySplitApi} from "../api/apiSlice";
import {Products, ProductState, DraftProduct, Error, FormErrors, Message} from "../api";

export const productApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Products | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/products${query}`: "/products",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.products) {
                    return ["Product", ...result.products.map(({ id }) => ({type: "Product" as const, id}))]
                } else {
                    return ["Product"]
                }
            }
        }),
        getProduct: builder.query<ProductState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/products/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Product", id: arg }]
        }),
        addNewProduct: builder.mutation<ProductState | FormErrors | Error, DraftProduct>({
            query: (category) => ({
                url: "/products",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Product"]
        }),
        editProduct: builder.mutation<ProductState | FormErrors | Error, DraftProduct>({
            query: (category) => ({
                url: "/products",
                method: "PATCH",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg.id }]
        }),
        destroyProduct: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Product"]
        })
    })
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useAddNewProductMutation,
    useEditProductMutation,
    useDestroyProductMutation,
} = productApi;