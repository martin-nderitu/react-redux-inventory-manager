import {createAsyncThunk, createSlice, createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {RootState} from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";
import {Product} from "../../api/server";


export interface ProductState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const productsAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & ProductState = productsAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});

export const fetchProducts = createAsyncThunk("product/fetchProducts", async (query: string = "") => {
    const response = await Product.findAll(query);
    return response.data;
})

export const createProduct = createAsyncThunk("product/createProduct", async (values: Body) => {
    const response = await Product.create(values);
    return response.data;
});

export const fetchProduct = createAsyncThunk("product/fetchProduct", async (productId: string) => {
    const response = await Product.find(productId);
    return response.data;
});

export const updateProduct = createAsyncThunk("product/updateProduct", async (values: Body) => {
    const response = await Product.update(values);
    return response.data;
});

export const destroyProduct = createAsyncThunk("product/destroyProduct", async (productId: string) => {
    const response = await Product.destroy(productId);
    return response.data;
});


const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const {products, pagination} = action.payload;
                if (products && pagination) {
                    state.pagination = pagination;
                    productsAdapter.setAll(state, products);
                }
                state.status = "succeeded";
            })

            .addCase(createProduct.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                const {product} = action.payload;
                if (product) {
                    productsAdapter.setOne(state, product);
                }
                state.status = "succeeded";
            })

            .addCase(fetchProduct.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                const {product} = action.payload;
                if (product) { productsAdapter.setOne(state, product) }
                state.status = "succeeded";
            })

            .addCase(updateProduct.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const {product} = action.payload;
                if (product) { productsAdapter.setOne(state, product) }
                state.status = "succeeded";
            })

            .addCase(destroyProduct.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroyProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});

export default productSlice.reducer;

export const {
    selectIds: selectProductIds,
    selectEntities: selectProductEntities,
    selectAll: selectAllProducts,
    selectTotal: selectTotalProducts,   // select total number of products in state
    selectById: selectProductById,
} = productsAdapter.getSelectors((state: RootState) => state.products);

export const selectProductPagination = (state: RootState) => state.products.pagination;

export const selectProductStatus = (state: RootState) => state.products.status;
