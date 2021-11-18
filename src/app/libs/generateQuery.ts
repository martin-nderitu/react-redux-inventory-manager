/**
 * generates a url query from an object
 * @param obj
 */
export function generateQuery(obj: { [k: string]: string | number }) {
    return "?" + Object.entries(obj).map( ([key, value]) => {
        if (value) { return `${key}=${value}` }
        return undefined;
    }).filter( (value) => value !== undefined ).join("&");
}