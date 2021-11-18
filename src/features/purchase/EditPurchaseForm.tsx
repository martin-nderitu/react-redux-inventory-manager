import {useState, useEffect, useCallback} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectPurchaseById,
    fetchPurchase,
    updatePurchase,
    destroyPurchase, fetchPurchases,
} from "./purchaseSlice";
import {RootState} from "../../app/store";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {isEmpty} from "../../app/libs/isEmpty";
import PurchaseSchema from "./PurchaseSchema";
import {Message} from "../../app";
import {IProduct, IPurchase, ISupplier} from "../index";
import {fetchSuppliers, selectAllSuppliers} from "../supplier/supplierSlice";
import {fetchProducts, selectAllProducts} from "../product/productSlice";



type TParams = { purchaseId: string; };


export const EditPurchaseForm = ({ match }: RouteComponentProps<TParams>) => {
    const { purchaseId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const purchase = useAppSelector((state: RootState) => selectPurchaseById(state, purchaseId)) as IPurchase | undefined;
    const suppliers = useAppSelector(selectAllSuppliers)
        // @ts-ignore
        .map( (supplier: ISupplier) => {
            return { value: supplier.id, label: supplier.name }
        });
    const products = useAppSelector(selectAllProducts)
        // @ts-ignore
        .map( (product: IProduct) => {
            return { value: product.id, label: product.name }
        });
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        if (purchaseId.length) {
            dispatch(fetchSuppliers("?limit=all"));
            dispatch(fetchProducts("?limit=all"));
            dispatch(fetchPurchase(purchaseId));
        }
    }, [purchaseId, dispatch]);

    const handleDestroy = useCallback(async () => {
        if (purchaseId.length) {
            const result = await dispatch(destroyPurchase(purchaseId));
            const { message, error, invalidData } = result.payload;
            if (message) {
                history.push({
                    pathname: "/purchases",
                    state: { message: { type: "success", message } }
                });
            }
            if (error) { setMessage({ type: "danger", message: error }) }
            if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }

            dispatch(fetchPurchases());
        }
    }, [purchaseId, dispatch, history])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={ purchase && !isEmpty(purchase) ? purchase : {
                supplierId: "", productId: "", quantity: "", unitCost: "", unitPrice: "", location: ""
            }}
            validationSchema={PurchaseSchema}
            onSubmit={async (values, actions) => {
                const result = await dispatch(updatePurchase(values));
                actions.setSubmitting(false);

                const {purchase, error, invalidData} = result.payload;

                if (purchase) {
                    const message = { type: "success", message: "Purchase updated successfully" }
                    history.push({
                        pathname: "/purchases",
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
                    {isEmpty(purchase) ? <Spinner/> : (
                        <form onSubmit={props.handleSubmit}>
                            <Select name="supplierId" label="Select supplier" options={suppliers} required={true}>
                                <option value="">Select a supplier</option>
                            </Select>
                            <Select name="productId" label="Select product" options={products} required={true}>
                                <option value="">Select a product</option>
                            </Select>
                            <Input name="quantity" label="Quantity" type="number" placeholder="Enter quantity" required={true} />
                            <Input name="unitCost" label="Unit cost" type="number" placeholder="Enter product unit cost" required={true} />
                            <Input name="unitPrice" label="Unit price" type="number" placeholder="Enter product unit price" required={true} />
                            <Select name="location" label="Select location" required={true}>
                                <option value="">Select a location</option>
                                <option value="store">Store</option>
                                <option value="counter">Counter</option>
                            </Select>

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
                                data-bs-target="#deletePurchase"
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
            <FormCard title="Edit Purchase" message={message} setMessage={setMessage} cardBody={form} />

            <Modal
                id="deletePurchase"
                label="deletePurchaseLabel"
                title="Delete Purchase"
                body="Are you sure you want to delete this purchase? This action cannot be undone."
                handleAction={handleDestroy}
            />
        </>
    )
}
