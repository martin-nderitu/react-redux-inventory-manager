import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    fetchSuppliers,
    destroySupplier,
    selectAllSuppliers,
    selectSuppliersPagination,
} from "./supplierSlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";


const SuppliersSearchForm = () => (
    <Input name="name" label="Name" type="search"
           placeholder="Enter supplier name" inline={true} validation={false} />
);

export const SuppliersList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const suppliers = useAppSelector(selectAllSuppliers);
    const pagination = useAppSelector(selectSuppliersPagination);
    const cols = useMemo(() => [
        { name: "Name", accessor: "name", link: "/suppliers/:id" },
        { name: "Phone", accessor: "phone" },
        { name: "Email", accessor: "email" },
    ], []);

    useEffect(() => {
        dispatch(fetchSuppliers());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
            if (query.length) { dispatch(fetchSuppliers(query)) }
        }, [dispatch]
    );

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroySupplier(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchSuppliers());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={suppliers}
            pagination={pagination}
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
