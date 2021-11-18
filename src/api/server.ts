import {client} from "./client";
import {Body} from "./client";

function ApiFactory(endpoint: string) {
    const url = "/api/v1" + endpoint;

    return {
        findAll: async (query = "") => await client.get(`${url}${query}`),
        create: async (body: Body) => await client.post(url, body),
        find: async (id: string) => await client.get(`${url}/${id}`),
        update: async (body: Body) => await client.put(url, body),
        destroy: async (id: string) => await client.destroy(`${url}/${id}`),
    }
}

const Category = ApiFactory("/categories");
const Product = ApiFactory("/products");
const Purchase = ApiFactory("/purchases");
const Sale = {
    ...ApiFactory("/sales"),
    cancel: async (id: string) => await client.destroy(`/api/v1/sales/${id}/cancel`)
}
const Supplier = ApiFactory("/suppliers");
const Transfer = ApiFactory("/transfers");

export {
    Category, Product, Purchase, Sale, Supplier, Transfer
};

