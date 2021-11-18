import {useEffect, useState, useCallback} from "react";
import {PaginatorProps, UsePaginatorProps, Pages} from "./index";

function usePaginator ({ count, offset = 0, limit = count, currentPage = 1, onEachSide = 3 }: UsePaginatorProps) {
    const [from, setFrom] = useState(1);
    const [to, setTo] = useState(1);
    const [pages, setPages] = useState<Pages>( { pageList: [] });

    const getPages = useCallback(() => {
        const totalPages = (Math.ceil(count / limit));
        const pages: Pages = { pageList: [] };
        const pageList: ("..." | number)[] = [];

        if (currentPage > 1) {
            pages.first = 1;
            pages.prev = currentPage - 1;
        }

        if (currentPage < totalPages) {
            pages.next = currentPage + 1;
            pages.last = totalPages;
        }

        // pages on left of currentPage along with the current page
        if (currentPage > onEachSide) {   // to avoid negative pages
            for (let i = onEachSide; i >= 0; i--) { // >= ensures the current page is pushed
                pageList.push(currentPage - i)
            }
        } else {
            for (let i = 1; i <= currentPage; i++) {
                pageList.push(i);
            }
        }

        // pages on right of currentPage
        for (let i = 1; i <= onEachSide; i++) {
            let page = currentPage + i;
            if (page > totalPages) { break; }
            pageList.push(page);
        }

        if (pageList.length) {
            const lastElement = pageList[pageList.length-1];
            if (lastElement && lastElement < totalPages) {
                pageList.push("...", totalPages);
            }
        }

        pages.pageList = pageList;
        return pages;
    }, [count, limit, currentPage, onEachSide]);

    useEffect(() => {
        setPages(getPages());
        setFrom(offset + 1);
        let to = offset + limit;
        to = to > count ? count : to;
        setTo(to);
    }, [getPages, offset, limit, count]);


    return {
        from, to, count, pages, currentPage, showPaginator: Math.ceil(count / limit) > 1
    }
}

export default function Paginator ({ pageLimits, handleCurrentPageChange, handleLimitChange, ...rest }: PaginatorProps) {
    const { from, to, count, pages, currentPage, showPaginator } = usePaginator(rest);

    const handlePageClick = (page: number) => handleCurrentPageChange(page)

    const handlePageLimitChange = (event: any) => {
        let { value } = event.target;
        if (value) {
            if (value !== "all") { value = parseInt(value) }
            handleLimitChange(value)
        }
    }

    const PageItem = ({ page, label } : { page: number | undefined, label: string }) => {
        if (page === undefined) { return <></> }

        return (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageClick(page)}>
                    {label}
                </button>
            </li>
        );
    }

    const PageList = () => {
        const pageList = pages.pageList.map( page => {
            if (page === "...") {
                return (
                    <li key={page} className="page-item">
                        <span className="p-2">...</span>
                    </li>
                )
            }
            return (
                <li key={page} className={"page-item" + (page === currentPage ? " active" : "")}>
                    <button className="page-link" onClick={() => handlePageClick(page)}>{page}</button>
                </li>
            );
        });
        return <>{pageList}</>
    }

    const PageLimitOptions = () => {
        const pageLimitOptions = pageLimits.map( limit =>
            <option key={limit} value={limit}>{limit.toString()}</option>
        );

        return (
            <div className="float-md-end">
                <label htmlFor="limit">Rows:</label>
                <select
                    name="limit"
                    className="form-select-sm ms-2"
                    onChange={handlePageLimitChange}
                    value={rest.limit ? rest.limit.toString() : "all"}
                >
                    {pageLimitOptions}
                </select>
            </div>
        )
    }

    return (
        <div className="mb-3">
            <div className="row mb-3">
                <div className="col-12">
                    {showPaginator && (
                        <nav className="float-md-start" aria-label="paginator">
                            <ul className="pagination" id="pager">
                                <PageItem page={pages.first} label="First" />
                                <PageItem page={pages.prev} label="Prev" />
                                <PageList/>
                                <PageItem page={pages.next} label="Next" />
                                <PageItem page={pages.last} label="Last" />
                            </ul>
                        </nav>
                    )}
                    <PageLimitOptions/>
                </div>
            </div>

            <div className="text-lg-start">
                Showing {from} to {to} of {count} records
            </div>
        </div>
    );
}
