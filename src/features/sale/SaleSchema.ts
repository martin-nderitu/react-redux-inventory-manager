import * as Yup from "yup";

const SaleSchema = Yup.object({
    productId: Yup.string()
        .typeError("Product is required")
        .required("Product is required"),

    quantity: Yup.number()
        .typeError("Please provide a valid quantity")
        .required("Quantity is required")
        .positive("Quantity cannot be negative")
        .integer("Quantity must be an integer"),
});

export default SaleSchema;