import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    fetchPurchases,
    destroyPurchase,
    selectAllPurchases,
    selectPurchasesPagination,
} from "./purchaseSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";
import {IProduct, ISupplier} from "../index";


const PurchasesSearchForm = () => (
    <>
        <Input name="product" label="Product" type="search"
               placeholder="Enter product name" inline={true} validation={false} />
        <Input name="supplier" label="Supplier" type="search"
               placeholder="Enter supplier name" inline={true} validation={false} />
    </>
);

export const PurchasesList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const purchases = useAppSelector(selectAllPurchases);
    const pagination = useAppSelector(selectPurchasesPagination);
    const cols = useMemo(() => [
        {
            name: "",
            accessor: "id",
            link: "/purchases/:id",
            callback: (id: string) => "Edit"
        },
        {
            name: "Product",
            accessor: "product",
            link: "/products/:productId",
            callback: (product: IProduct | undefined) => product?.name,
        },
        {
            name: "Supplier",
            accessor: "supplier",
            link: "/suppliers/:supplierId",
            callback: (supplier: ISupplier) => supplier?.name,
        },
        { name: "Quantity", accessor: "quantity" },
        { name: "Unit cost", accessor: "unitCost" },
        { name: "Unit price", accessor: "unitPrice" },
        { name: "Location", accessor: "location" },
    ], []);

    useEffect(() => {
        dispatch(fetchPurchases());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
        if (query.length) { dispatch(fetchPurchases(query)) }
        }, [dispatch]
    );

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroyPurchase(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchPurchases());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={purchases}
            pagination={pagination}
            title="Purchases"
            message={message}
            setMessage={setMessage}
            createItemLink="/purchases/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ product: "", supplier: "" }}
            SearchFormInputs={PurchasesSearchForm}
        />
    );
});
