import React, {useMemo, useEffect, useCallback, useState} from "react";

import {useGetPurchasesQuery, useDestroyPurchaseMutation} from "./purchaseSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app/index";
import {Product, Supplier} from "../api";


const PurchasesSearchForm = () => (
    <>
        <Input name="product" label="Product" type="search"
               placeholder="Enter product name" inline={true} validation={false} />
        <Input name="supplier" label="Supplier" type="search"
               placeholder="Enter supplier name" inline={true} validation={false} />
    </>
);

export const PurchasesList = React.memo(() => {
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetPurchasesQuery(query);
    const [destroyPurchase] = useDestroyPurchaseMutation();
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
            callback: (product: Product) => product.name,
        },
        {
            name: "Supplier",
            accessor: "supplier",
            link: "/suppliers/:supplierId",
            callback: (supplier: Supplier) => supplier.name,
        },
        { name: "Quantity", accessor: "quantity" },
        { name: "Unit cost", accessor: "unitCost" },
        { name: "Unit price", accessor: "unitPrice" },
        { name: "Location", accessor: "location" },
    ], []);

    const purchases = (
        result.isSuccess ? (
            result.data.purchases ? result.data.purchases : []
        ) : null
    );

    useEffect(() => {
        if (result.data?.error) {
            setMessage({ type: "danger", message: result.data.error })
        }
    }, [result.data?.error]);

    const handleQuery = useCallback((query: string) => {
        if (query.length) { setQuery(query) }
    }, []);

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            try {
                const {message, error, invalidData} = await destroyPurchase(checked.join()).unwrap();
                if (message) { setMessage({ type: "success", message }) }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [destroyPurchase]);

    return (
        <DataTable
            cols={cols}
            data={purchases}
            pagination={result.isSuccess && result.data.pagination ? result.data.pagination : { count: 0 }}
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
