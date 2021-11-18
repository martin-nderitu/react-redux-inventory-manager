import { FC } from "react";
import { useField, FieldMetaProps } from "formik";
import {
    FieldWrapperProps, InputField, SelectField, SelectFieldOption, DataListField, TextAreaField
} from "./index";


const FieldWrapper = ({ inline, idOrName, label, required, children }: FieldWrapperProps) => {
    const classes = inline
        ? { div: "col-auto", label: "visually-hidden" }
        : { div: "mb-3", label: "form-label" };

    return (
        <div className={classes.div}>
            <label className={classes.label} htmlFor={idOrName}>
                {label}
                { required && <span className="text-danger"> *</span> }
            </label>
            {children}
        </div>
    );
}

const ErrorMessage = ({ meta }: { meta: FieldMetaProps<any> }) => {
    const {touched, error} = meta;
    
    return (
        <>
            {touched && error && (
                <div className="form-text text-danger text-md-start" key={error}>
                    <span>{error}</span>
                </div>
            )}
        </>
    );
}

const fieldClassName = (meta: FieldMetaProps<any>, value: string | number | readonly string[]="", validation = true) => {
    const { touched, error } = meta;

    let classes = "form-control rounded-0";

    if (validation) {
        if (touched && error) { classes += " is-invalid" }
        if (touched && !error) { classes += " is-valid" }
    }
    return classes;
}

const Input: FC<InputField> = ({ label, inline=false, validation, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <FieldWrapper inline={inline} idOrName={ props.id || props.name } label={label} required={props.required}>
            <input className={fieldClassName(meta, props.value, validation)} {...field} {...props} />
            <ErrorMessage meta={meta} />
        </FieldWrapper>
    )
}

const Checkbox: FC<InputField> = ({ label, inline=false, validation, ...props}) => {
    const [field, meta] = useField(props);

    const checkBox =  (
        <div className="mt-3 mb-3 form-check">
            <input className="form-check-input" type="checkbox" {...field} {...props} />
            <label className="form-check-label" htmlFor={props.id || props.name}>
                {label}
                { props.required && <span className="text-danger"> *</span> }
            </label>
            <ErrorMessage meta={meta} />
        </div>
    );

    if (inline) { return ( <div className="col-auto">{checkBox}</div> ) }
    return (checkBox);
}

const Select: FC<SelectField> = ({ label, inline=false, validation, options, children, ...props}) => {
    const [field, meta] = useField(props);

    const selectOptions = (() => {
        if (options?.length) {
            return (
                options.map((option: SelectFieldOption) => {
                    if (typeof option === "string") {
                        return <option key={option} value={option}>{option}</option>
                    }
                    return (
                        <option key={`${option.value}`} value={option.value}>
                            {option.label}
                        </option>
                    )
                })
            )
        }
    })();

    return (
        <FieldWrapper inline={inline} idOrName={props.name} label={label} required={props.required}>
            <select className={fieldClassName(meta, props.value, validation)} {...field} {...props}>
                <>
                    {children}
                    {selectOptions}
                </>
            </select>
            <ErrorMessage meta={meta} />
        </FieldWrapper>
    );
}

const DataList: FC<DataListField> = ({ label, inline=false, validation, options, ...props}) => {
    const [field, meta] = useField(props);

    const dataList = (
        <datalist id={`${props.name}-list`}>
            {options?.length && options.map(option => {
                return ( <option key={option}> {option.toString()} </option> );
            })}
        </datalist>
    );

    return (
        <FieldWrapper inline={inline} idOrName={props.name} label={label} required={props.required}>
            <input className={fieldClassName(meta, props.value, validation)} {...field} {...props} list={`${props.name}-list`} />
            {dataList}
            <ErrorMessage meta={meta} />
        </FieldWrapper>
    );
}

const TextArea: FC<TextAreaField> = ({ label, inline=false, validation, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <FieldWrapper inline={inline} idOrName={props.name} label={label} required={props.required}>
            <textarea className={fieldClassName(meta, props.value, validation)} rows={5} {...field} {...props}>
                {props.value}
            </textarea>
            <ErrorMessage meta={meta} />
        </FieldWrapper>
    );
}

export { Input, Checkbox, Select, DataList, TextArea }