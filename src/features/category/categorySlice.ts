import {emptySplitApi} from "../api/apiSlice";
import {Categories, CategoryState, DraftCategory, Error, FormErrors, Message} from "../api";

export const categoryApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Categories | Error, string | void>({
            query: (query) => ({
                url: query && query.length ? `/categories${query}`: "/categories",
                validateStatus: (response, result) => {
                    if (result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.categories) {
                    return ["Category", ...result.categories.map(({ id }) => ({type: "Category" as const, id}))]
                } else {
                    return ["Category"]
                }
            }
        }),
        getCategory: builder.query<CategoryState | FormErrors | Error, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            providesTags: (result, error, arg) => [{ type: "Category", id: arg }]
        }),
        addNewCategory: builder.mutation<CategoryState | FormErrors | Error, DraftCategory>({
            query: (category) => ({
                url: "/categories",
                method: "POST",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Category"]
        }),
        editCategory: builder.mutation<CategoryState | FormErrors | Error, DraftCategory>({
            query: (category) => ({
                url: "/categories",
                method: "PATCH",
                body: category,
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Category", id: arg.id }]
        }),
        destroyCategory: builder.mutation<Message | FormErrors | Error, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
                validateStatus: (response, result) => {
                    if (result?.invalidData || result?.error) { return true }
                    return response.ok;
                },
            }),
            invalidatesTags: ["Category"]
        })
    })
})

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useAddNewCategoryMutation,
    useEditCategoryMutation,
    useDestroyCategoryMutation,
} = categoryApi;