import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {createSale} from "./salesSlice";
import {fetchProducts, selectAllProducts} from "../product/productSlice";
import {Input, Select} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import SaleSchema from "./SaleSchema";
import {IProduct} from "../index";
import {Message} from "../../app";


export const AddSaleForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const products = useAppSelector(selectAllProducts)
        // @ts-ignore
        .map( (product: IProduct) => {
            return { value: product.id, label: product.name }
        });
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(fetchProducts("?limit=all"));
    }, [dispatch]);

    const form = (
        <Formik
            initialValues={{ productId: "", quantity: "" }}
            validationSchema={SaleSchema}
            onSubmit={async (values, actions) => {
                const result = await dispatch(createSale(values));
                actions.setSubmitting(false);

                const {sale, error, invalidData} = result.payload;

                if (sale) {
                    const message = { type: "success", message: "Sale created successfully" }
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
                            {props.isSubmitting ? <ButtonSpinner text="Adding" /> : "Add"}
                        </button>
                    </form>
                </>
            )}
        </Formik>
    );

    return ( <FormCard title="Add Sale" message={message} setMessage={setMessage} cardBody={form} /> )
}
