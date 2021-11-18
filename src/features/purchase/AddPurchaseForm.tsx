import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {createPurchase} from "./purchaseSlice";
import {fetchSuppliers, selectAllSuppliers} from "../supplier/supplierSlice";
import {fetchProducts, selectAllProducts} from "../product/productSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import PurchaseSchema from "./PurchaseSchema";
import {IProduct, ISupplier} from "../index";
import {Message} from "../../app";


export const AddPurchaseForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
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
        dispatch(fetchSuppliers("?limit=all"));
        dispatch(fetchProducts("?limit=all"));
    }, [dispatch]);

    const form = (
        <Formik
            initialValues={{
                supplierId: "", productId: "", quantity: "", unitCost: "", unitPrice: "", location: ""
            }}
            validationSchema={PurchaseSchema}
            onSubmit={async (values, actions) => {
                const result = await dispatch(createPurchase(values));
                actions.setSubmitting(false);
                const {purchase, error, invalidData} = result.payload;

                if (purchase) {
                    const message = { type: "success", message: "Purchase created successfully" }
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
