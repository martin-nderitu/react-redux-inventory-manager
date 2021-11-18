import {useState, useEffect, useCallback} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {RootState} from "../../app/store";
import {
    selectProductById,
    fetchProduct,
    updateProduct,
    destroyProduct, fetchProducts,
} from "./productSlice";
import {fetchCategories, selectAllCategories} from "../category/categorySlice";
import {Input, Select, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {isEmpty} from "../../app/libs/isEmpty";
import {ProductSchema} from "./ProductSchema";
import {Message} from "../../app";
import {ICategory, IProduct} from "../index";

type TParams = { productId: string; };

export const EditProductForm = ({ match }: RouteComponentProps<TParams>) => {
    const { productId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const product = useAppSelector((state: RootState) => selectProductById(state, productId)) as IProduct | undefined;
    const categories = useAppSelector(selectAllCategories)
        // @ts-ignore
        .map( (category: ICategory) => {
        return { value: category.id, label: category.name }
    });
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        if (productId.length) {
            dispatch(fetchCategories("?limit=all"));
            dispatch(fetchProduct(productId));
        }
    }, [productId, dispatch]);

    const handleDestroy = useCallback(async () => {
        if (productId.length) {
            const result = await dispatch(destroyProduct(productId));
            const { message, error, invalidData } = result.payload;
            if (message) {
                history.push({
                    pathname: "/products",
                    state: { message: { type: "success", message } }
                });
            }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchProducts());
        }
    }, [productId, dispatch, history])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={product && !isEmpty(product) ? product : {
                name: "", unitCost: "", unitPrice: "", store: "", counter: "",
                description: undefined, categoryId: ""
            }}
            validationSchema={ProductSchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                const result = await dispatch(updateProduct(values));
                actions.setSubmitting(false);

                const {product, error, invalidData} = result.payload;

                if (product) {
                    const message = { type: "success", message: "Product updated successfully" }
                    history.push({
                        pathname: "/products",
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
                    {isEmpty(product) ? <Spinner/> : (
                        <form onSubmit={props.handleSubmit}>
                            <Input name="name" label="Name" type="text" placeholder="Enter product name" required={true} />
                            <Input name="unitCost" label="Unit cost" type="number" placeholder="Enter product unit cost" required={true} />
                            <Input name="unitPrice" label="Unit price" type="number" placeholder="Enter product unit price" required={true} />
                            <Input name="store" label="Store" type="number" placeholder="Enter number of items in store" required={true} />
                            <Input name="counter" label="Counter" type="number" placeholder="Enter number of items in counter" required={true} />
                            <Select name="categoryId" label="Select category" options={categories} required={true}>
                                <option value="">Select a category</option>
                            </Select>
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
                                data-bs-target="#deleteProduct"
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
            <FormCard title="Edit Product" message={message} setMessage={setMessage} cardBody={form} />

            <Modal
                id="deleteProduct"
                label="deleteProductLabel"
                title="Delete Product"
                body="Are you sure you want to delete this product? This action cannot be undone."
                handleAction={handleDestroy}
            />
        </>
    )
}
