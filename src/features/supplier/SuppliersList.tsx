import React, {useMemo, useEffect, useCallback, useState} from "react";

import {useGetSuppliersQuery, useDestroySupplierMutation} from "./supplierSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app/index";


const SuppliersSearchForm = () => (
    <Input name="name" label="Name" type="search"
           placeholder="Enter supplier name" inline={true} validation={false} />
);

export const SuppliersList = React.memo(() => {
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetSuppliersQuery(query);
    const [destroySupplier] = useDestroySupplierMutation();
    const cols = useMemo(() => [
        { name: "Name", accessor: "name", link: "/suppliers/:id" },
        { name: "Phone", accessor: "phone" },
        { name: "Email", accessor: "email" },
    ], []);

    const suppliers = (
        result.isSuccess ? (
            result.data.suppliers ? result.data.suppliers : []
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
                const {message, error, invalidData} = await destroySupplier(checked.join()).unwrap();
                if (message) { setMessage({ type: "success", message }) }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [destroySupplier]);

    return (
        <DataTable
            cols={cols}
            data={suppliers}
            pagination={result.isSuccess && result.data.pagination ? result.data.pagination : { count: 0 }}
            title="Suppliers"
            message={message}
            setMessage={setMessage}
            createItemLink="/suppliers/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ name: "" }}
            SearchFormInputs={SuppliersSearchForm}
        />
    );
});
