import {useState} from "react";
import {useAppDispatch} from "../../app/hooks";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {createSupplier} from "./supplierSlice";
import {Input} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import SupplierSchema from "./SupplierSchema";
import {Message} from "../../app";


export const AddSupplierForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const history = useHistory();

    const form = (
        <Formik
            initialValues={{ name: "", phone: "", email: undefined }}
            validationSchema={SupplierSchema}
            onSubmit={async (values, actions) => {
                if (values.email === "") { delete values.email; }
                const result = await dispatch(createSupplier(values));
                actions.setSubmitting(false);

                const {supplier, error, invalidData} = result.payload;
                console.log("payload = ", result.payload)

                if (supplier) {
                    const message = { type: "success", message: "Supplier created successfully" }
                    history.push({
                        pathname: "/suppliers",
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
