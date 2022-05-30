import {useState, useEffect, useCallback, useMemo} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useGetPurchaseQuery, useEditPurchaseMutation, useDestroyPurchaseMutation} from "./purchaseSlice";
import {useGetSuppliersQuery} from "../supplier/supplierSlice";
import {useGetProductsQuery} from "../product/productSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import PurchaseSchema from "./PurchaseSchema";
import {Message} from "../../app/index";
import {Product, Supplier} from "../api";


type TParams = { purchaseId: string; };


export const EditPurchaseForm = ({ match }: RouteComponentProps<TParams>) => {
    const { purchaseId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetPurchaseQuery(purchaseId);
    const [updatePurchase] = useEditPurchaseMutation();
    const [destroyPurchase] = useDestroyPurchaseMutation();
    const allProducts = useGetProductsQuery("?limit=all");
    const allSuppliers = useGetSuppliersQuery("?limit=all");
    const products = useMemo(() => {
        if (allProducts.isSuccess && allProducts.data.products) {
            return allProducts.data.products.map( (product: Product) => ({ value: product.id, label: product.name }))
        }
        return [{ value: "", label: "No results found" }]
    }, [allProducts.isSuccess, allProducts.data?.products]);
    const suppliers = useMemo(() => {
        if (allSuppliers.isSuccess && allSuppliers.data.suppliers) {
            return allSuppliers.data.suppliers.map( (supplier: Supplier) => ({ value: supplier.id, label: supplier.name }))
        }
        return [{ value: "", label: "No results found" }]
    }, [allSuppliers.isSuccess, allSuppliers.data?.suppliers]);
    const initialValues = useMemo(() => {
        if (result.isSuccess && result.data.purchase) {
            return {...result.data.purchase};
        }
        else {
            return { supplierId: "", productId: "", quantity: "", unitCost: "", unitPrice: "", location: "" }
        }
    }, [result.isSuccess, result.data?.purchase])
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const handleDestroy = useCallback(async () => {
        if (purchaseId.length) {
            try {
                const {message, error, invalidData} = await destroyPurchase(purchaseId).unwrap();
                if (message) {
                    history.push({
                        pathname: "/purchases",
                        state: { message: { type: "success", message } }
                    });
                }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [purchaseId, history, destroyPurchase])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={PurchaseSchema}
            onSubmit={async (values, actions) => {
                try {
                    const {purchase, error, invalidData} = await updatePurchase(values).unwrap();
                    actions.setSubmitting(false);
                    if (purchase) {
                        const message = { type: "success", message: "Purchase updated successfully" }
                        history.push({
                            pathname: "/purchases",
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
