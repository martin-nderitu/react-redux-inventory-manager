import {useState} from "react";
import {useHistory} from "react-router-dom";
import {Formik} from "formik";

import {useAppDispatch} from "../../app/hooks";
import {createCategory} from "./categorySlice";
import {Input, TextArea} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import {CategorySchema} from "./CategorySchema";
import {Message} from "../../app";


export const AddCategoryForm = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const dispatch = useAppDispatch();
    const history = useHistory();

    const form = (
        <Formik
            initialValues={{ name: "", description: undefined, }}
            validationSchema={CategorySchema}
            onSubmit={async (values, actions) => {
                if (values.description === "") { delete values.description; }
                const result = await dispatch(createCategory(values));
                actions.setSubmitting(false);

                const {category, error, invalidData} = result.payload;

                if (category) {
                    const message = { type: "success", message: "Category created successfully" }
                    history.push({
                        pathname: "/categories",
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
                        <Input name="name" label="Name" type="text" placeholder="Enter category name" required={true} />
                        <TextArea name="description" label="Description" />

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

    return ( <FormCard title="Add Category" message={message} setMessage={setMessage} cardBody={form} /> )
}