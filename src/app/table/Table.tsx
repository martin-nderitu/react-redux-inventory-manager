import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {isEmpty} from "../libs/isEmpty";
import {TableProps} from "./index";


export default function Table ({ cols, data, checked, setChecked, selection }: TableProps) {
    const [ids] = useState<string[]>(() => {
        if (selection) { return data.map((item) => item.id) }
        else { return [] }
    });
    const selectAllRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const checkedItems = Object.keys(checked).filter(id => checked[id]);
       if (selectAllRef.current !== null) {
           selectAllRef.current.indeterminate = checkedItems.length > 0 && checkedItems.length !== ids.length;
       }
    }, [ids.length, checked]);

    // handle checkbox click
    const handleClick = (event: any) => {
        const {target} = event;
        const temp: any = {};

        if (target.id === "0") {    // id for select all checkbox
            for (const id of ids) { temp[id] = target.checked; }
        } else {
            temp[target.id] = target.checked;
        }
        setChecked({...checked, ...temp});
    }

    // check whether a checkbox is checked
    const isChecked = (id: number) => {
        if (isEmpty(checked)) { return false; }

        if (id === 0) {
            for (const id of ids) {
                if (!checked[id]) { return false; }
            }
            return true;
        }
        return !!checked[id];
    }

    const renderTableHeader = () => {
        return cols.map( (col, index) => {
            return (
                <th key={col.name} scope="col">{col.name}</th>
            );
        });
    }

    const renderTd = (item: any) => {
        return cols.map( (col) => {
            let label = "";
            let tdChild: JSX.Element;

            if (col.callback) { label = col.callback(item[col.accessor]) }
            else { label = item[col.accessor] }

            if (col.link) {
                const [path, itemId] = col.link.split(":");
                tdChild = <Link to={ `${path}${item[itemId]}` }>{ label }</Link>
            } else {
                tdChild = <> { label } </>
            }

            return (
                <td key={ `${col.accessor}${item.id}` } className="text-left">{ tdChild }</td>
            );
        });
    }

    const renderSelectAllCheckbox = (render: boolean) => {
        const checkbox = (
            <input
                key="selectAll"
                type="checkbox"
                className="form-check-input"
                // @ts-ignore
                id={0}
                checked={isChecked(0)}
                onChange={handleClick}
                // @ts-ignore
                ref={selectAllRef}
            />
        );

        if (render) return (
            <th scope="col" style={{width: 50}}>{checkbox}</th>
        );
    }

    const renderCheckbox = (render: boolean, id: any) => {
        const checkbox = (
            <input
                key={`item${id}`}
                type="checkbox"
                className="form-check-input"
                id={id}
                checked={isChecked(id)}
                onChange={handleClick}
            />
        );

        if (render) return (
            <td key={`checkbox${id}`}>{checkbox}</td>
        );
    }

    const renderTableBody = () => {
        return data.map( (item) => {
            return (
                <tr key={`tr${item.id}`}>
                    {renderCheckbox(selection, item.id)}
                    { renderTd(item) }
                </tr>
            );
        });
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className="text-white bg-success">
                <tr>
                    { renderSelectAllCheckbox(selection) }
                    { renderTableHeader() }
                </tr>
                </thead>
                <tbody>
                    { renderTableBody() }
                </tbody>
            </table>
        </div>
    );
}
