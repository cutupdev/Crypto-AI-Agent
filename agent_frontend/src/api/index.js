export const requestAPI = async (url, method, body = null, bUseToken = false, bStringifyBody = true, contentType="application/json") => {
    try {
        const headers = {};
        if (contentType) {
            headers["Content-Type"] = contentType;
        };

        if (bUseToken) {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body ? (bStringifyBody ? JSON.stringify(body) : body) : null,
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};