import React from "react";
import {Message} from "../index";


interface Col {
    name: string;
    accessor: string;
    link?: string;
    callback?: (value: any) => string;
}

export interface Item {
    [k: string]: any;
    id: string;
}

export interface TableProps {
    cols: Col [];
    data: Item[];
    checked: { [k: string]: boolean };
    setChecked: React.Dispatch<React.SetStateAction<{ [k: string]: boolean }>>
    selection: boolean;
}

export interface DataTableProps {
    cols: Col[];
    data: Item[] | null;
    pagination: Pagination;
    title: string;
    message: Message | null;
    setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
    handleQuery: (query: string) => void;
    destroyChecked: (checked: string[]) => void;
    createItemLink?: string;
    displayMessages?: boolean;
    selection?: boolean;
    pageLimits?: (string | number)[];
    searchFormInitialValues?: {[k: string]: string };
    SearchFormInputs?: () => JSX.Element;
}

export interface Pages {
    [k: string]: number | ("..." | number)[];
    first?: number;
    prev?: number;
    next?: number;
    last?: number;
    pageList: ("..." | number)[];
}

export interface Pagination {
    [k: string]: any;
    count: number; // total number of items
    offset?: number; // items to skip
    limit?: number;  // items per page
    currentPage?: number;
}

export interface PaginatorProps extends Pagination {
    pageLimits: (string | number)[];    // options in page limits select input
    handleCurrentPageChange: (page: number) => void;
    handleLimitChange: (limit: number) => void;
    onEachSide?: number;
}

export interface UsePaginatorProps extends Pagination {
    onEachSide?: number;
}

export interface SearchFormProps {
    initialValues: { [k: string]: any };
    FormInputs: () => JSX.Element;
    handleSubmit: (values: { [k: string]: string }) => void;
}