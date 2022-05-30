import {useState, useEffect} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import Table from "./Table";
import Actions from "../actions/Actions";
import Spinner from "../spinners/Spinner";
import Alert from "../alert/Alert";
import Paginator from "./Paginator";
import {DataTableProps, SearchFormProps} from "./index";
import {Formik} from "formik";
import ButtonSpinner from "../spinners/ButtonSpinner";
import {isEmpty} from "../libs/isEmpty";
import {generateQuery} from "../libs/generateQuery";
import {Message} from "../index";


interface LocationState {
    message?: Message;
}

function SearchForm({ initialValues, FormInputs, handleSubmit }: SearchFormProps) {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
            }}
        >
            {props => (
                <div className="container-fluid pt-3">
                    <form onSubmit={props.handleSubmit} className="row gy-2 gx-3 align-items-center">
                        <FormInputs />

                        <div className="col-auto">
                            <button
                                type="submit"
                                className="btn btn-primary rounded-0"
                                disabled={props.isSubmitting}
                            >
                                {props.isSubmitting ? <ButtonSpinner /> : "Search"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </Formik>
    );
}

export default function DataTable (props: DataTableProps) {
    const {
        cols,
        data = null,
        pagination,
        title,
        message,
        setMessage,
        handleQuery,
        destroyChecked,
        createItemLink,
        displayMessages = true,    // display alert messages
        selection = true,
        pageLimits = [5, 10, 15, 25, 50, "all"],
        searchFormInitialValues,
        SearchFormInputs,   // html input fields for search form
    } = props;
    const [checked, setChecked] = useState<{[k: string]: boolean}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchFormValues, setSearchFormValues] = useState<{ [k: string]: string }>(
        searchFormInitialValues || {}
    );
    const stringifiedSearchFormValues = JSON.stringify(searchFormValues);
    const stringifiedData = JSON.stringify(data);
    const location = useLocation<LocationState>();
    const history = useHistory<LocationState>();

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            history.replace({ state: {} });
        }
    }, [history, location.state?.message, setMessage]);

    useEffect(() => {
        if (stringifiedData !== "null") { setIsLoading(false) }
    }, [stringifiedData])

    useEffect(() => {
        setPage(1)
    }, [stringifiedSearchFormValues, limit]);

    useEffect(() => {
        const query = generateQuery({ ...searchFormValues, page, limit });
        handleQuery(query);
    },[page, limit, stringifiedSearchFormValues, handleQuery, searchFormValues]);

    const handleSearchFormSubmit = (values: {[k: string]: string}) => setSearchFormValues({...values});

    const handleDestroy = () => {
        destroyChecked(Object.keys(checked).filter(id => checked[id]));
        setChecked({});
    }

    return (
        <div className="container-fluid pt-3">
            { displayMessages && message && (
                <div className="pb-1">
                    <Alert message={message} setMessage={setMessage} />
                </div>
            )}
            <div className="card shadow-lg rounded-0">
                <div className="card-header text-white bg-success rounded-0">
                    <h4 className="text-lg-start float-md-start">{title}</h4>

                    {createItemLink && (
                        <Link to={createItemLink} className="btn btn-primary float-md-end rounded-0">Create</Link>
                    )}

                    {SearchFormInputs && searchFormInitialValues && !isEmpty(searchFormInitialValues) && (
                        <div className="row col-12">
                            <SearchForm
                                initialValues={searchFormInitialValues}
                                FormInputs={SearchFormInputs}
                                handleSubmit={handleSearchFormSubmit}
                            />
                        </div>
                    )}

                    <Actions
                        checked={checked}
                        title={title}
                        handleDestroy={handleDestroy}
                    />

                </div>

                <div className="card-body">
                    {isLoading ? <Spinner/> : (
                        <>
                            {data && data.length > 0 ?
                                <Table
                                    cols={cols}
                                    data={data}
                                    checked={checked}
                                    setChecked={setChecked}
                                    selection={selection}
                                />
                                : <h3 className="text-center">No {title.toLowerCase()} found</h3>
                            }
                        </>
                    )}
                </div>

                {data && data.length > 0 && (
                    <div className="card-footer border-white">
                        <Paginator
                            {...pagination}
                            pageLimits={pageLimits}
                            handleCurrentPageChange={setPage}
                            handleLimitChange={setLimit}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
