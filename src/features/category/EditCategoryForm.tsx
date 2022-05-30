import {useEffect, useCallback, useState, useMemo} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useGetCategoryQuery, useEditCategoryMutation, useDestroyCategoryMutation} from "./categorySlice";
import {Input, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {CategorySchema} from "./CategorySchema";
import {Message} from "../../app/index";


type TParams = { categoryId: string; };

export const EditCategoryForm = ({ match }: RouteComponentProps<TParams>) => {
    const { categoryId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetCategoryQuery(categoryId);
    const [updateCategory] = useEditCategoryMutation();
    const [destroyCategory] = useDestroyCategoryMutation();
    const initialValues = useMemo(() => {
        if (result.isSuccess && result.data.category) {
            const category = {...result.data.category};
            if (category.description === null) { category.description = "" }
            return category
        }
        else { return { name: "", description: "" } }
    }, [result.isSuccess, result.data?.category])
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const handleDestroy = useCallback(async () => {
        if (categoryId.length) {
            try {
                const {message, error, invalidData} = await destroyCategory(categoryId).unwrap();
                if (message) {
                    history.push({
                        pathname: "/categories",
                        state: { message: { type: "success", message } }
                    });
                }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [categoryId, history, destroyCategory]);

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={CategorySchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                try {
                    const {category, error, invalidData} = await updateCategory(values).unwrap();
                    actions.setSubmitting(false);
                    if (category) {
                        const message = { type: "success", message: "Category updated successfully" }
                        history.push({
                            pathname: "/categories",
                            state: { message }
                        });
                    }
                    if (error) { setMessage({ type: "danger", message: error }) }
                    if (invalidData) {
                        actions.setErrors(invalidData);
                        setMessage({ type: "danger", message: "Please correct the errors below" });
                    }
                } catch (error) {
                    setMessage({ type: "danger", message: error.message });
                }
            }}
        >
            {props => (
                <>
                    {result.isFetching ? <Spinner/> : (
                        <form onSubmit={props.handleSubmit}>
                            <Input name="name" label="Name" type="text" placeholder="Enter category name" required={true} />
                            <TextArea name="description" label="Description" />

                            <button
                                type="submit"
                                className="btn btn-primary rounded-0 me-2 mt-3"
                                disabled={props.isSubmitting}
                            >
                                {props.isSubmitting ? <ButtonSpinner text="Updating" /> : "Update"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger rounded-0 mt-3"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteCategory"
                            >
                                Delete
                            </button>
                        </form>
                    )}
                </>
            )}
        </Formik>
    );

    return (
        <>
            <FormCard title="Edit Category" message={message} setMessage={setMessage} cardBody={form} />

            <Modal
                id="deleteCategory"
                label="deleteCategoryLabel"
                title="Delete Category"
                body="Are you sure you want to delete this category? This action cannot be undone."
                handleAction={handleDestroy}
            />
        </>
    )
}
