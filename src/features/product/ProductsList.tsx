import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    fetchProducts, selectAllProducts, selectProductPagination, destroyProduct,
} from "./productSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";
import {ICategory} from "../index";


const ProductsSearchForm = () => (
    <Input name="name" label="Name" type="search" placeholder="Enter product name" inline={true} validation={false} />
);

export const ProductsList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectAllProducts);
    const pagination = useAppSelector(selectProductPagination);
    const cols = useMemo(() => [
        { name: "Name", accessor: "name", link: "/products/:id" },
        { name: "Unit cost", accessor: "unitCost" },
        { name: "Unit price", accessor: "unitPrice" },
        { name: "Store", accessor: "store" },
        { name: "Counter", accessor: "counter" },
        {
            name: "Category",
            accessor: "category",
            link: "/category/:categoryId",
            callback: (category: ICategory | undefined) => category?.name,
        },
    ], []);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
        if (query.length) { dispatch(fetchProducts(query)) }
        }, [dispatch]
    );


    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroyProduct(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchProducts());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={products}
            pagination={pagination}
            title="Products"
            message={message}
            setMessage={setMessage}
            createItemLink="/products/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ name: "" }}
            SearchFormInputs={ProductsSearchForm}
        />
    );
});
