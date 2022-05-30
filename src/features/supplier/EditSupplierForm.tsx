import {useState, useEffect, useCallback, useMemo} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import {Formik} from "formik";

import {useGetSupplierQuery, useEditSupplierMutation, useDestroySupplierMutation} from "./supplierSlice";
import {Input} from "../../app/form/fields";
import FormCard from "../../app/card/FormCard";
import Modal from "../../app/modal/Modal";
import Spinner from "../../app/spinners/Spinner";
import ButtonSpinner from "../../app/spinners/ButtonSpinner";
import SupplierSchema from "./SupplierSchema";
import {Message} from "../../app/index";


type TParams = { supplierId: string; };


export const EditSupplierForm = ({ match }: RouteComponentProps<TParams>) => {
    const { supplierId } = match.params;
    const [message, setMessage] = useState<Message | null>(null);
    const result = useGetSupplierQuery(supplierId);
    const [updateSupplier] = useEditSupplierMutation();
    const [destroySupplier] = useDestroySupplierMutation();
    const initialValues = useMemo(() => {
        if (result.isSuccess && result.data.supplier) {
            return {...result.data.supplier};
        }
        else {
            return { name: "", phone: "", email: "" }
        }
    }, [result.isSuccess, result.data?.supplier])
    const history = useHistory();

    useEffect(() => {
        if (message?.type && message?.message) {
            window.scrollTo(0, 0);
        }
    }, [message?.type, message?.message])

    const handleDestroy = useCallback(async () => {
        if (supplierId.length) {
            try {
                const {message, error, invalidData} = await destroySupplier(supplierId).unwrap();
                if (message) {
                    history.push({
                        pathname: "/suppliers",
                        state: { message: { type: "success", message } }
                    });
                }
                if (error) { setMessage({ type: "danger", message: error }) }
                if (invalidData) { setMessage({ type: "danger", message: invalidData.id }) }
            } catch (error) {
                setMessage({ type: "danger", message: error.message });
            }
        }
    }, [supplierId, history, destroySupplier])

    const form = (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={SupplierSchema}
            onSubmit={async (values, actions) => {
                if (values.email === "") { delete values.email; }
                try {
                    const {supplier, error, invalidData} = await updateSupplier(values).unwrap();
                    actions.setSubmitting(false);
                    if (supplier) {
                        const message = { type: "success", message: "Supplier updated successfully" }
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
                    {result.isFetching ? <Spinner/> : (
                        <form onSubmit={props.handleSubmit}>
                            <Input name="name" label="Name" type="text" placeholder="Enter supplier's name" required={true} />
                            <Input name="phone" label="Phone" type="text" placeholder="Enter supplier's phone number" required={true} />
                            <Input name="email" label="Email" type="email" placeholder="Enter supplier's email" />

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
                                data-bs-target="#deleteSupplier"
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
            <FormCard title="Edit Supplier" message={message} setMessage={setMessage} cardBody={form} />

            <Modal
                id="deleteSupplier"
                label="deleteSupplierLabel"
                title="Delete Supplier"
                body="Are you sure you want to delete this supplier? This action cannot be undone."
                handleAction={handleDestroy}
            />
        </>
    )
}
