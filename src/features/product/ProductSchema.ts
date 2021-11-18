import * as Yup from "yup";

export const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .typeError("Product name is required")
        .required("Product name is required")
        .min(2, "Product name must be at least 2 characters long")
        .max(50, "Product name must not exceed 50 characters"),

    unitCost: Yup.number()
        .typeError("Unit cost must be a number")
        .required("Unit cost is required")
        .positive("Unit cost cannot be negative")
        .test(
            "maxTwoDecimalPoints",
            "Unit price must have at most 2 decimal points",
            // @ts-ignore
            (number) => /^\d+(\.\d{1,2})?$/.test(number)
        ),

    unitPrice: Yup.number()
        .typeError("Unit price must be a number")
        .required("Unit price is required")
        .positive("Unit price cannot be negative")
        .test(
            "maxTwoDecimalPoints",
            "Unit price must have at most 2 decimal points",
            // @ts-ignore
            (number) => /^\d+(\.\d{1,2})?$/.test(number)
        ),

    store: Yup.number()
        .typeError("Please provide a valid number for items in store")
        .required("Number of items in store is required")
        .positive("Items in store cannot be negative")
        .integer("Items in store must be an integer"),

    counter: Yup.number()
        .typeError("Please provide a valid number for items in counter")
        .required("Number of items in counter is required")
        .positive("Items in counter cannot be negative")
        .integer("Items in counter must be an integer"),

    description: Yup.string()
        .min(5, "Description should be at least 5 characters long")
        .max(255, "Description should not exceed 255 characters")
});
