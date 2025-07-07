const featchData = async (endpoint: { url: string; method: string }, body: any) => {
    const res = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
};
const GetData = async (endpoint: { url: string; method: string }) => {
    const res = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(res)
    return res.json();
};

const handleStoreUser = (data: {
    _id: string;
    name: string;
    email: string;
}) => {
    setCookie("user", JSON.stringify(data), 7);
};

const handleGetUser = () => {
    const user = getCookie("user");
    return user ? JSON.parse(user) : null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const cookieValue = encodeURIComponent(value) +
        ((days) ? `; expires=${expirationDate.toUTCString()}` : '') +
        '; path=/';

    document.cookie = `${name}=${cookieValue}`;
};

const getCookie = (name: string): string | null => {
    const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};

const deleteCookie = (name: string) => {
    setCookie(name, '', -1);
};


export { featchData, handleStoreUser, handleGetUser, setCookie, getCookie, deleteCookie, GetData };