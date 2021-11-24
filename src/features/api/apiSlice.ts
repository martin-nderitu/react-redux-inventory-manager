import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const emptySplitApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    tagTypes: ["Category", "Product", "Purchase", "Sale", "Supplier", "Transfer"],
    endpoints: () => ({}),
})
