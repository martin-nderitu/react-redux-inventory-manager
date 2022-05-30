import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {useAddNewSupplierMutation} from "./supplierSlice";
import {Input} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import SupplierSchema from "./SupplierSchema";
import {Message} from "../../app/index";
import {DraftSupplier} from "../api";


export const AddSupplierForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const [addNewSupplier] = useAddNewSupplierMutation();
    const history = useHistory();
    const initialValues: DraftSupplier = { name: "", phone: "", email: "" }

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const form = (
        <Formik
            initialValues={initialValues}
            validationSchema={SupplierSchema}
            onSubmit={async (values, actions) => {
                if (values.email === "") { delete values.email; }
                try {
                    const {supplier, error, invalidData} = await addNewSupplier(values).unwrap();
                    actions.setSubmitting(false);
                    if (supplier) {
                        const message = { type: "success", message: "Supplier created successfully" }
                        history.push({
                            pathname: "/suppliers",
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
                        <Input name="name" label="Name" type="text" placeholder="Enter supplier's name" required={true} />
                        <Input name="phone" label="Phone" type="text" placeholder="Enter supplier's phone number" required={true} />
                        <Input name="email" label="Email" type="email" placeholder="Enter supplier's email" />
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

    return ( <FormCard title="Add Supplier" message={message} setMessage={setMessage} cardBody={form} /> )
}
