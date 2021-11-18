import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {createProduct} from "./productSlice";
import {fetchCategories, selectAllCategories} from "../category/categorySlice";
import {Input, Select, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {ProductSchema} from "./ProductSchema";
import {ICategory} from "../index";
import {Message} from "../../app";


export const AddProductForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const categories = useAppSelector(selectAllCategories)
        // @ts-ignore
        .map( (category: ICategory) => {
            return { value: category.id, label: category.name }
        });
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(fetchCategories("?limit=all"));
    }, [dispatch]);

    const form = (
        <Formik
            initialValues={{
                name: "", unitCost: "", unitPrice: "", store: "", counter: "",
                description: undefined, categoryId: ""
            }}
            validationSchema={ProductSchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                const result = await dispatch(createProduct(values));
                actions.setSubmitting(false);

                const {product, error, invalidData} = result.payload;

                if (product) {
                    const message = { type: "success", message: "Product created successfully" }
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
                    <form onSubmit={props.handleSubmit}>
                        <Input name="name" label="Name" type="text" placeholder="Enter product name" required={true} />
                        <Input name="unitCost" label="Unit cost" type="number" placeholder="Enter product unit cost" required={true} />
                        <Input name="unitPrice" label="Unit price" type="number" placeholder="Enter product unit price" required={true} />
                        <Input name="store" label="Store" type="number" placeholder="Enter number of items in store" required={true} />
                        <Input name="counter" label="Counter" type="number" placeholder="Enter number of items in counter" required={true} />
                        <Select name="categoryId" label="Select category" options={categories} required={true}>
                            <option value="">Select a category</option>
                        </Select>
                        <TextArea name="description" label="Description" placeholder="Enter a description for the product" />

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

    return ( <FormCard title="Add Product" message={message} setMessage={setMessage} cardBody={form} /> )
}
