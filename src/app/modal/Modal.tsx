import {ModalProps} from "./index";

export default function Modal({ id, label, title, body, handleAction, actionLabel = "Delete" }: ModalProps) {

    const modalHeader = (
        <div className="modal-header rounded-0 text-white bg-success">
            <h5 className="modal-title" id={title}>{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
        </div>
    );

    const modalBody = (
        <div className="modal-body text-dark">
            <p className="text-lg-start">{body}</p>
        </div>
    );

    const modalFooter = (
        <div className="modal-footer border-white">
            <button type="button" className="btn btn-secondary rounded-0" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-danger rounded-0" onClick={handleAction} data-bs-dismiss="modal">
                {actionLabel}
            </button>
        </div>
    );

    return (
        // @ts-ignore
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={label} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content rounded-0">
                    {modalHeader}
                    {modalBody}
                    {modalFooter}
                </div>
            </div>
        </div>
    );
}
