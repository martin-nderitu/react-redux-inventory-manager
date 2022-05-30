import {useEffect, useState, useMemo} from "react";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {useAddNewPurchaseMutation} from "./purchaseSlice";
import {useGetProductsQuery} from "../product/productSlice";
import {useGetSuppliersQuery} from "../supplier/supplierSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import PurchaseSchema from "./PurchaseSchema";
import {Product, Supplier} from "../api";
import {Message} from "../../app/index";


export const AddPurchaseForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const [addNewPurchase] = useAddNewPurchaseMutation();
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
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const form = (
        <Formik
            initialValues={{
                supplierId: "", productId: "", quantity: "", unitCost: "", unitPrice: "", location: ""
            }}
            validationSchema={PurchaseSchema}
            onSubmit={async (values, actions) => {
                try {
                    const {purchase, error, invalidData} = await addNewPurchase(values).unwrap();
                    actions.setSubmitting(false);
                    if (purchase) {
                        const message = { type: "success", message: "Purchase created successfully" }
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
                            {props.isSubmitting ? <ButtonSpinner text="Adding" /> : "Add"}
                        </button>
                    </form>
                </>
            )}
        </Formik>
    );

    return ( <FormCard title="Add Purchase" message={message} setMessage={setMessage} cardBody={form} /> )
}
