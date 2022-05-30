import {useState, useEffect, useCallback, useMemo} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useGetSaleQuery, useEditSaleMutation, useCancelSaleMutation, useDestroySaleMutation} from "./salesSlice";
import {useGetProductsQuery} from "../product/productSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import SaleSchema from "./SaleSchema";
import {Message} from "../../app/index";
import {Product} from "../api";


type TParams = { saleId: string; };


export const EditSaleForm = ({ match }: RouteComponentProps<TParams>) => {
    const { saleId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetSaleQuery(saleId);
    const [updateSale] = useEditSaleMutation();
    const [cancelSale] = useCancelSaleMutation();
    const [destroySale] = useDestroySaleMutation();
    const allProducts = useGetProductsQuery("?limit=all");
    const products = useMemo(() => {
        if (allProducts.isSuccess && allProducts.data.products) {
            return allProducts.data.products.map( (product: Product) => ({ value: product.id, label: product.name }))
        }
        return [{ value: "", label: "No results found" }]
    }, [allProducts.isSuccess, allProducts.data?.products]);
    const initialValues = useMemo(() => {
        if (result.isSuccess && result.data.sale) {
            return {...result.data.sale};
        }
        else {
            return { productId: "", quantity: "" }
        }
    }, [result.isSuccess, result.data?.sale])
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const handleDestroy = useCallback(async () => {
        if (saleId.length) {
            try {
                const {message, error, invalidData} = await destroySale(saleId).unwrap();
                if (message) {
                    history.push({
                        pathname: "/sales",
                        state: { message: { type: "success", message } }
                    });
                }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [saleId, history, destroySale])

    const handleCancel = useCallback(async () => {
        if (saleId.length) {
            try {
                const {message, error, invalidData} = await cancelSale(saleId).unwrap();
                if (message) {
                    history.push({
                        pathname: "/sales",
                        state: { message: { type: "success", message } }
                    });
                }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            };
        }
    }, [saleId, history, cancelSale])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={SaleSchema}
            onSubmit={async (values, actions) => {
                try {
                    const {sale, error, invalidData} = await updateSale(values).unwrap();
                    actions.setSubmitting(false);
                    if (sale) {
                        const message = { type: "success", message: "Sale updated successfully" }
                        history.push({
                            pathname: "/sales",
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
                            <Select name="productId" label="Select product" options={products} required={true}>
                                <option value="">Select a product</option>
                            </Select>
                            <Input name="quantity" label="Quantity" type="number" placeholder="Enter quantity" required={true} />

                            <button
                                type="submit"
                                className="btn btn-primary rounded-0 me-2 mt-3"
                                disabled={props.isSubmitting}
                            >
                                {props.isSubmitting ? <ButtonSpinner text="Updating" /> : "Update"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger rounded-0 me-2 mt-3"
                                data-bs-toggle="modal"
                                data-bs-target="#cancelSale"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger rounded-0 mt-3"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteSale"
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
            <FormCard title="Edit Sale" message={message} setMessage={setMessage} cardBody={form} />

            <Modal
                id="deleteSale"
                label="deleteSaleLabel"
                title="Delete Sale"
                body="Are you sure you want to delete this sale? This action cannot be undone."
                handleAction={handleDestroy}
            />

            <Modal
                id="cancelSale"
                label="cancelSaleLabel"
                title="Cancel Sale"
                body="Are you sure you want to cancel this sale? This action cannot be undone."
                handleAction={handleCancel}
                actionLabel="Cancel"
            />
        </>
    )
}
