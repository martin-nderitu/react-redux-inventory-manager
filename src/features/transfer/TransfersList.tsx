import React, {useMemo, useEffect, useCallback, useState} from "react";

import {useGetTransfersQuery, useDestroyTransferMutation} from "./transferSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app/index";
import {Product} from "../api";


const TransfersSearchForm = () => (
    <Input name="product" label="Product" type="search"
           placeholder="Enter product name" inline={true} validation={false} />
);

export const TransfersList = React.memo(() => {
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetTransfersQuery(query);
    const [destroyTransfer] = useDestroyTransferMutation();
    const cols = useMemo(() => [
        {
            name: "Product",
            accessor: "product",
            link: "/products/:productId",
            callback: (product: Product) => product.name,
        },
        { name: "Quantity", accessor: "quantity" },
        { name: "Source", accessor: "source" },
        { name: "Destination", accessor: "destination" },
    ], []);

    const transfers = (
        result.isSuccess ? (
            result.data.transfers ? result.data.transfers : []
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
                const {message, error, invalidData} = await destroyTransfer(checked.join()).unwrap();
                if (message) { setMessage({ type: "success", message }) }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [destroyTransfer]);

    return (
        <DataTable
            cols={cols}
            data={transfers}
            pagination={result.isSuccess && result.data.pagination ? result.data.pagination : { count: 0 }}
            title="Transfers"
            message={message}
            setMessage={setMessage}
            createItemLink="/transfers/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ product: "" }}
            SearchFormInputs={TransfersSearchForm}
        />
    );
});
