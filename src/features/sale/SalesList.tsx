import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    fetchSales,
    destroySale,
    selectAllSales,
    selectSalesPagination,
} from "./salesSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";
import {IProduct} from "../index";


const SalesSearchForm = () => (
    <Input name="product" label="Product" type="search"
           placeholder="Enter product name" inline={true} validation={false} />
);

export const SalesList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const sales = useAppSelector(selectAllSales);
    const pagination = useAppSelector(selectSalesPagination);
    const cols = useMemo(() => [
        {
            name: "",
            accessor: "id",
            link: "/sales/:id",
            callback: (id: string) => "Edit"
        },
        {
            name: "Product",
            accessor: "product",
            link: "/products/:productId",
            callback: (product: IProduct | undefined) => product?.name,
        },
        { name: "Quantity", accessor: "quantity" },
    ], []);

    useEffect(() => {
        dispatch(fetchSales());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
            if (query.length) { dispatch(fetchSales(query)) }
        }, [dispatch]
    );

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroySale(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchSales());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={sales}
            pagination={pagination}
            title="Sales"
            message={message}
            setMessage={setMessage}
            createItemLink="/sales/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ product: "" }}
            SearchFormInputs={SalesSearchForm}
        />
    );
});
