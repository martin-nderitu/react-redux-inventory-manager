import React, {useMemo, useEffect, useCallback, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {
    destroyCategory,
    fetchCategories, selectAllCategories, selectCategoryPagination
} from "./categorySlice";
import DataTable from "../../app/table/DataTable";
import {Input} from "../../app/form/fields";
import {Message} from "../../app";


const CategoriesSearchForm = () => (
    <Input name="name" label="Name" type="search" placeholder="Enter category name" inline={true} validation={false} />
);

export const CategoriesList = React.memo(() => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories);
    const pagination = useAppSelector(selectCategoryPagination);
    const cols = useMemo(() => [
        { name: "Name", accessor: "name", link: "/categories/:id" },
        { name: "Description", accessor: "description" },
    ], []);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleQuery = useCallback((query: string) => {
            if (query.length) { dispatch(fetchCategories(query)) }
        }, [dispatch]
    );

    const destroyChecked = useCallback(async (checked: string[]) => {
        if (checked.length) {
            const result = await dispatch(destroyCategory(checked.join()));
            const { message, error, invalidData } = result.payload;
            if (message) { setMessage({ type: "success", message }) }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchCategories());
        }
    }, [dispatch]);

    return (
        <DataTable
            cols={cols}
            data={categories}
            pagination={pagination}
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