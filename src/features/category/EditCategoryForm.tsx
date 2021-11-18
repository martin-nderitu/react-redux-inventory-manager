import {useEffect, useCallback, useState} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchCategory, updateCategory, selectCategoryById, destroyCategory, fetchCategories} from "./categorySlice";
import {RootState} from "../../app/store";
import {Input, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {isEmpty} from "../../app/libs/isEmpty";
import {CategorySchema} from "./CategorySchema";
import {Message} from "../../app";
import {ICategory} from "../index";


type TParams = { categoryId: string; };

export const EditCategoryForm = ({ match }: RouteComponentProps<TParams>) => {
    const { categoryId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const category = useAppSelector((state: RootState) => selectCategoryById(state, categoryId)) as ICategory | undefined;
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        if (categoryId.length) {
            dispatch(fetchCategory(categoryId));
        }
    }, [categoryId, dispatch]);

    const handleDestroy = useCallback(async () => {
        if (categoryId.length) {
            const result = await dispatch(destroyCategory(categoryId));
            const { message, error, invalidData } = result.payload;
            if (message) {
                history.push({
                    pathname: "/categories",
                    state: { message: { type: "success", message } }
                });
            }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchCategories());
        }
    }, [categoryId, dispatch, history]);

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={category && !isEmpty(category) ? category : { name: "", description: undefined } }
            validationSchema={CategorySchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                const result = await dispatch(updateCategory(values));
                actions.setSubmitting(false);

                const {category, error, invalidData} = result.payload;

                if (category) {
                    const message = { type: "success", message: "Category updated successfully" }
                    history.push({
                        pathname: "/categories",
                        state: { message }
                    });
                }
                if (error) {
                    window.scrollTo(0, 0);
                    setMessage({ type: "danger", message: error });
                }
                if (invalidData) {
                    window.scrollTo(0, 0);
                    actions.setErrors(invalidData);
                    setMessage({
                        type: "danger", message: "Please correct the errors below"
                    });
                }
            }}
        >
            {props => (
                <>
                    {isEmpty(category) ? <Spinner/> : (
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
