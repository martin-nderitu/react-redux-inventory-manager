export type Body = { [k: string]: string | number | undefined };

interface CustomConfig {
    [k: string]: any;
    method: "POST" | "PUT" | "GET" | "DELETE";
    body?: Body;
    headers?: { [k: string]: string };
}

interface Config {
    [k: string]: any;
    method: "POST" | "PUT" | "GET" | "DELETE";
    body?: string;
    headers?: { [k: string]: string };
}


export const client = async (url: string, { method, body, ...rest }: CustomConfig) => {
    let headers: { [k: string]: string } = {
        "Accept": "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
    };

    const config: Config = {
        method,
        headers: {
            ...headers,
            ...rest.headers,
        }
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    try {
        const response = await window.fetch(url, config)
        const data = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            headers: response.headers,
            url: response.url,
            data,
        }
    } catch (err) {
        return Promise.reject(err.message)
    }
}

client.get = (url: string, customConfig = {}) => {
    return client(url, { method: "GET", ...customConfig });
}

client.post = (url: string, body: Body, customConfig = {}) => {
    return client(url, { method: "POST", body, ...customConfig })
}

client.put = (url: string, body: Body, customConfig = {}) => {
    return client(url, { method: "PUT", body, ...customConfig })
}

client.destroy = (url: string, customConfig = {}) => {
    return client(url, { method: "DELETE", ...customConfig });
}
