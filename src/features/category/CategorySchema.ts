import * as Yup from "yup";

export const CategorySchema = Yup.object().shape({
    name: Yup.string()
        .typeError("Product name is required")
        .required("Product name is required")
        .min(2, "Product name must be at least 2 characters long")
        .max(50, "Product name must not exceed 50 characters")
        .matches(/^[aA-zZ\s]+$/, "Product name must be alphabetic"),

    description: Yup.string()
        .min(5, "Description should be at least 5 characters long")
        .max(255, "Description should not exceed 255 characters")
});
