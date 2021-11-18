import {useState, useEffect, useCallback} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectSaleById,
    fetchSale,
    updateSale,
    destroySale,
    fetchSales,
    cancelSale,
} from "./salesSlice";
import {fetchProducts, selectAllProducts} from "../product/productSlice";
import {RootState} from "../../app/store";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {isEmpty} from "../../app/libs/isEmpty";
import SaleSchema from "./SaleSchema";
import {Message} from "../../app";
import {IProduct, ISale} from "../index";


type TParams = { saleId: string; };


export const EditSaleForm = ({ match }: RouteComponentProps<TParams>) => {
    const { saleId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const sale = useAppSelector((state: RootState) => selectSaleById(state, saleId)) as ISale | undefined;
    const products = useAppSelector(selectAllProducts)
        // @ts-ignore
        .map( (product: IProduct) => {
            return { value: product.id, label: product.name }
        });
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        if (saleId.length) {
            dispatch(fetchProducts("?limit=all"));
            dispatch(fetchSale(saleId));
        }
    }, [saleId, dispatch]);

    const handleDestroy = useCallback(async () => {
        if (saleId.length) {
            const result = await dispatch(destroySale(saleId));
            const { message, error, invalidData } = result.payload;
            if (message) {
                history.push({
                    pathname: "/sales",
                    state: { message: { type: "success", message } }
                });
            }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchSales());
        }
    }, [saleId, dispatch, history])

    const handleCancel = useCallback(async () => {
        if (saleId.length) {
            const result = await dispatch(cancelSale(saleId));
            const { message, error, invalidData } = result.payload;
            if (message) {
                history.push({
                    pathname: "/sales",
                    state: { message: { type: "success", message } }
                });
            }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchSales());
        }
    }, [saleId, dispatch, history])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={ sale && !isEmpty(sale) ? sale : { productId: "", quantity: "" } }
            validationSchema={SaleSchema}
            onSubmit={async (values, actions) => {
                const result = await dispatch(updateSale(values));
                actions.setSubmitting(false);

                const {sale, error, invalidData} = result.payload;

                if (sale) {
                    const message = { type: "success", message: "Sale updated successfully" }
                    history.push({
                        pathname: "/sales",
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
                    {isEmpty(sale) ? <Spinner/> : (
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
