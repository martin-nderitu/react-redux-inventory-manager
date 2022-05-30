import {useEffect, useState, useMemo} from "react";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {useAddNewProductMutation} from "./productSlice";
import {useGetCategoriesQuery} from "../category/categorySlice";
import {Input, Select, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {ProductSchema} from "./ProductSchema";
import {Message} from "../../app/index";
import {Category, DraftProduct} from "../api";


export const AddProductForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const [addNewProduct] = useAddNewProductMutation();
    const result = useGetCategoriesQuery("?limit=all");
    const history = useHistory();
    const initialValues: DraftProduct = {
        name: "", unitCost: "", unitPrice: "", store: "", counter: "", description: "", categoryId: ""
    }
    const categories = useMemo(() => {
        if (result.isSuccess && result.data.categories) {
            return result.data.categories.map( (category: Category) => ({ value: category.id, label: category.name }))
        }
        return [{ value: "", label: "No results found" }]
    }, [result.isSuccess, result.data?.categories])

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const form = (
        <Formik
            initialValues={initialValues}
            validationSchema={ProductSchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                try {
                    const {product, error, invalidData} = await addNewProduct(values).unwrap();
                    actions.setSubmitting(false);
                    if (product) {
                        const message = { type: "success", message: "Product created successfully" }
                        history.push({
                            pathname: "/products",
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
