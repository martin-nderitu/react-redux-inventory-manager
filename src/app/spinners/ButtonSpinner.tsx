import {ButtonSpinnerProps} from "./index";

export default function ButtonSpinner({ text = null }: ButtonSpinnerProps) {
    return (
        <>
            {text && <span className="p-2">{text}</span>}
            <span className="spinner-border spinner-border-sm" role="status"/>
        </>
    );
}
