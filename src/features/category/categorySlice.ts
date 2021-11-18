import {createAsyncThunk, createEntityAdapter, createSlice, EntityState} from "@reduxjs/toolkit";
import {Category} from "../../api/server";
import {RootState} from '../../app/store';
import {Pagination} from "../../app/table";
import {Body} from "../../api/client";

interface CategoryState {
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const categoriesAdapter = createEntityAdapter();

const initialState: EntityState<unknown> & CategoryState = categoriesAdapter.getInitialState({
    pagination: {
        count: 0, offset: 0, limit: 0, currentPage: 1
    },
    status: "idle",
});

export const fetchCategories = createAsyncThunk("category/fetchCategories", async (query: string = "") => {
    const response = await Category.findAll(query);
    return response.data;
})

export const createCategory = createAsyncThunk("category/createCategory", async (values: Body) => {
    const response = await Category.create(values);
    return response.data;
});

export const fetchCategory = createAsyncThunk("category/fetchCategory", async (categoryId: string) => {
    const response = await Category.find(categoryId);
    return response.data;
});

export const updateCategory = createAsyncThunk("category/updateCategory", async (values: Body) => {
    const response = await Category.update(values);
    return response.data;
});

export const destroyCategory = createAsyncThunk("category/destroyCategory", async (categoryId: string) => {
    const response = await Category.destroy(categoryId);
    return response.data;
});


const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCategories.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                const {categories, pagination} = action.payload;
                if (categories && pagination) {
                    state.pagination = pagination;
                    categoriesAdapter.setAll(state, categories);
                }
                state.status = "succeeded";
            })

            .addCase(createCategory.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                const {category} = action.payload;
                if (category) {
                    categoriesAdapter.setOne(state, category);
                }
                state.status = "succeeded";
            })

            .addCase(fetchCategory.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                const {category} = action.payload;
                if (category) { categoriesAdapter.setOne(state, category) }
                state.status = "succeeded";
            })

            .addCase(updateCategory.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const {category} = action.payload;
                if (category) { categoriesAdapter.setOne(state, category) }
                state.status = "succeeded";
            })

            .addCase(destroyCategory.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(destroyCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
    }
});

export default categorySlice.reducer;

export const {
    selectIds: selectCategoryIds,
    selectEntities: selectCategoryEntities,
    selectAll: selectAllCategories,
    selectTotal: selectTotalCategories,   // select total number of categories in state
    selectById: selectCategoryById,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export const selectCategoryPagination = (state: RootState) => state.categories.pagination;

export const selectCategoryStatus = (state: RootState) => state.categories.status;
