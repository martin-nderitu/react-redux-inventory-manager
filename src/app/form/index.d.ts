import React, {InputHTMLAttributes} from "react";

interface FieldProps {
    label: string;
    inline?: boolean;
    validation?: boolean;
}

export interface InputField extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
    name: string;
}

export interface DataListField extends InputField {
    options: string [];
}

export type SelectFieldOption = ({ value: (string | number); label: string } | string);

export interface SelectField extends InputHTMLAttributes<HTMLSelectElement>, FieldProps {
    name: string;
    options?: SelectFieldOption[];
    children?: React.ReactNode;
}

export interface TextAreaField extends InputHTMLAttributes<HTMLTextAreaElement>, FieldProps {
    name: string;
}

export interface FieldWrapperProps {
    inline?: boolean | undefined,
    idOrName: string;
    label: string;
    required?: boolean;
    children: React.ReactNode;
}