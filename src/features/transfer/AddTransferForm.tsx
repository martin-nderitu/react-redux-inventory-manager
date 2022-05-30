import {useEffect, useMemo, useState} from "react";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {useAddNewTransferMutation} from "./transferSlice";
import {useGetProductsQuery} from "../product/productSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import TransferSchema from "./TransferSchema";
import {Product} from "../api";
import {Message} from "../../app/index";

export const AddTransferForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const [addNewTransfer] = useAddNewTransferMutation();
    const allProducts = useGetProductsQuery("?limit=all");
    const products = useMemo(() => {
        if (allProducts.isSuccess && allProducts.data.products) {
            return allProducts.data.products.map( (product: Product) => ({ value: product.id, label: product.name }))
        }
        return [{ value: "", label: "No results found" }]
    }, [allProducts.isSuccess, allProducts.data?.products]);
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const form = (
        <Formik
            initialValues={{ productId: "", quantity: "", source: "", destination: "" }}
            validationSchema={TransferSchema}
            onSubmit={async (values, actions) => {
                const destination = values.source === "store" ? "counter" : "store";
                values = { ...values, destination };
                try {
                    const {transfer, error, invalidData} = await addNewTransfer(values).unwrap();
                    actions.setSubmitting(false);
                    if (transfer) {
                        const message = { type: "success", message: "Transfer created successfully" }
                        history.push({
                            pathname: "/transfers",
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
                        <Select name="productId" label="Select product" options={products} required={true}>
                            <option value="">Select a product</option>
                        </Select>
                        <Input name="quantity" label="Quantity" type="number" placeholder="Enter quantity" required={true} />
                        <Select name="source" label="Select source location" required={true}>
                            <option value="">Select source location</option>
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

    return ( <FormCard title="Add Transfer" message={message} setMessage={setMessage} cardBody={form} /> )
}
