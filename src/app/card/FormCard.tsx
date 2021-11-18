import {isEmpty} from "../libs/isEmpty";
import {CardProps} from "./index";
import Alert from "../alert/Alert";


export default function FormCard({ title, message, setMessage, cardBody, cardFooter = (<></>) }: CardProps) {
    return (
        <div className="container-fluid pt-5">
            <div className="row">
                <div className="col-md-7 mx-auto col-lg-5">
                    { message && !isEmpty(message) && (
                        <div className="pb-1">
                            <Alert message={message} setMessage={setMessage} />
                        </div>
                    )}
                    <div className="card shadow-lg rounded-0">
                        <div className="card-header text-white bg-success rounded-0">
                            <h4 className="text-lg-start">{title}</h4>
                            <span className="text-danger"> *</span><span> Required fields</span>
                        </div>

                        <div className="card-body">{cardBody}</div>

                        { cardFooter && <div className="card-footer">{ cardFooter }</div> }
                    </div>
                </div>
            </div>
        </div>
    );
}
