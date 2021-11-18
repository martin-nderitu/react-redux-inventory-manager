import * as Yup from "yup";

const TransferSchema = Yup.object({
    productId: Yup.string()
        .typeError("Product is required")
        .required("Product is required"),

    quantity: Yup.number()
        .typeError("Quantity is required")
        .required("Quantity is required")
        .positive("Quantity must be greater than 0")
        .integer("Quantity must be an integer"),

    source: Yup.mixed()
        .oneOf(["store", "counter"], "Valid location are 'store' or 'counter'"),
});

export default TransferSchema;
