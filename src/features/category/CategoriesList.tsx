import React, {useMemo, useCallback, useState, useEffect} from "react";

import {useGetCategoriesQuery, useDestroyCategoryMutation} from "./categorySlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app/index";


const CategoriesSearchForm = () => (
    <Input name="name" label="Name" type="search" placeholder="Enter category name" inline={true} validation={false} />
);

export const CategoriesList = React.memo(() => {
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetCategoriesQuery(query);
    const [destroyCategory] = useDestroyCategoryMutation();
    const cols = useMemo(() => [
        { name: "Name", accessor: "name", link: "/categories/:id" },
        { name: "Description", accessor: "description" },
    ], []);

    const categories = (
        result.isSuccess ? (
            result.data.categories ? result.data.categories : []
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
                const {message, error, invalidData} = await destroyCategory(checked.join()).unwrap();
                if (message) { setMessage({ type: "success", message }) }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [destroyCategory]);

    return (
        <DataTable
            cols={cols}
            data={categories}
            pagination={result.isSuccess && result.data.pagination ? result.data.pagination : { count: 0 }}
            title="Categories"
            message={message}
            setMessage={setMessage}
            createItemLink="/categories/create"
            handleQuery={handleQuery}
            destroyChecked={destroyChecked}
            searchFormInitialValues={{ name: "" }}
            SearchFormInputs={CategoriesSearchForm}
        />
    );
});