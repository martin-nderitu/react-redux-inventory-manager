import * as Yup from "yup";

const PurchaseSchema = Yup.object({
    supplierId: Yup.string()
        .typeError("Supplier is required")
        .required("Supplier is required"),

    productId: Yup.string()
        .typeError("Product is required")
        .required("Product is required"),

    quantity: Yup.number()
        .typeError("Quantity is required")
        .required("Quantity is required")
        .positive("Quantity must be greater than 0")
        .integer("Quantity must be an integer"),

    unitCost: Yup.number()
        .typeError("Unit cost is required")
        .required("Unit cost is required")
        .positive("Unit cost must be greater than 0")
        .test(
            "maxTwoDecimalPoints",
            "Unit cost must not exceed 2 decimal points",
            // @ts-ignore
            (number) => /^\d+(\.\d{1,2})?$/.test(number)
        ),

    unitPrice: Yup.number()
        .typeError("Unit price is required")
        .required("Unit price is required")
        .positive("Unit price must be greater than 0")
        .test(
            "maxTwoDecimalPoints",
            "Unit price must not exceed 2 decimal points",
            // @ts-ignore
            (number) => /^\d+(\.\d{1,2})?$/.test(number)
        )
        .test(
            "notLessThanUnitCost",
            "Unit price cannot be less than unit cost",
            function (value) {
                const unitCost = parseFloat(this.parent.unitCost);
                if (unitCost) {
                    // @ts-ignore
                    return parseFloat(value) >= unitCost;
                }
                return true;
            }
        ),
    location: Yup.mixed()
        .oneOf(["store", "counter"], "Valid location are 'store' or 'counter'"),
});

export default PurchaseSchema;