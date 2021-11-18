import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    fetchTransfers,
    destroyTransfer,
    selectAllTransfers,
    selectTransfersPagination
} from "./transferSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";
import {IProduct} from "../index";


const TransfersSearchForm = () => (
    <Input name="product" label="Product" type="search"
           placeholder="Enter product name" inline={true} validation={false} />
);

export const TransfersList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const transfers = useAppSelector(selectAllTransfers);
    const pagination = useAppSelector(selectTransfersPagination);
    const cols = useMemo(() => [
        {
            name: "Product",
            accessor: "product",
            link: "/products/:productId",
            callback: (product: IProduct | undefined) => product?.name,
        },
        { name: "Quantity", accessor: "quantity" },
        { name: "Source", accessor: "source" },
        { name: "Destination", accessor: "destination" },
    ], []);

    useEffect(() => {
        dispatch(fetchTransfers());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
            if (query.length) { dispatch(fetchTransfers(query)) }
        }, [dispatch]
    );

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroyTransfer(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchTransfers());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={transfers}
            pagination={pagination}
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
