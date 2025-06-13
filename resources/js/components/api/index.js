import { method } from "lodash";
import { getAuth, logoutUser } from "../utils";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useGlobalContext } from "../contexts";

export const _REQ_METHOD = { GET: 'GET', POST: 'POST', DELETE: 'DELETE', PUT: 'PUT' }

export const _REQUEST_APP = (url, method, data) => {
    return new Promise((resolve, reject) => {
        // Map HTTP methods to Axios functions
        const axiosMethods = {
            GET: axios.get,
            POST: axios.post,
            PUT: axios.put,
            DELETE: axios.delete,
        };

        // Ensure the method is valid
        if (!axiosMethods[method]) {
            return reject(new Error(`Unsupported HTTP method: ${method}`));
        }

        // Determine the request configuration
        const requestConfig = {
            ...(method === 'GET' ? { params: data } : { ...data }), // Use `params` for GET and `data` for others
        };
        // Make the request using the selected Axios method
        axiosMethods[method](`${window.location.origin}/api/app/${url}`, requestConfig)
            .then(res => resolve(res.data)) // Resolve with the response data
            .catch(err => reject(err)); // Reject with the error
    });
}
export const _REQUEST = (url, method, data = {}) => {
    console.log(`${window.location.origin}/api/${url}`);

    return new Promise((resolve, reject) => {
        const axiosMethods = {
            GET: axios.get,
            POST: axios.post,
            PUT: axios.put,
            DELETE: axios.delete,
        };

        if (!axiosMethods[method]) {
            return reject(new Error(`Unsupported HTTP method: ${method}`));
        }

        const auth = JSON.parse(localStorage.getItem('auth'));
        const token = auth?.token;

        const headers = {
            'Authorization': `Bearer ${token || ''}`,
            'Content-Type': 'application/json',
        };

        const baseUrl = `${window.location.origin}/api/${url}`;

        const config = { headers };

        if (method === 'GET') {
            config.params = data;
            axiosMethods[method](baseUrl, config)
                .then(res => resolve(res.data))
                .catch(err => reject(err.response?.data || { message: err.message }));
        }
        else if (method === 'DELETE') {
            axiosMethods[method](baseUrl, { ...config, data })
                .then(res => resolve(res.data))
                .catch(err => {
                    reject(err.response?.data || { message: err.message });
                });
        }
        else {
            axiosMethods[method](baseUrl, data, config)
                .then(res => resolve(res.data))
                .catch(err => {
                    // if (err.response?.status === 401) {
                    //     logoutUser(); // optional
                    // }
                    reject(err.response?.data || { message: err.message });
                });
        }
    });
};
// export const _REQUEST = (url, method, data) => {

//     return new Promise((resolve, reject) => {
//         const axiosMethods = {
//             GET: axios.get,
//             POST: axios.post,
//             PUT: axios.put,
//             DELETE: axios.delete,
//         };

//         if (!axiosMethods[method]) {
//             return reject(new Error(`Unsupported HTTP method: ${method}`));
//         }

//         const auth = JSON.parse(localStorage.getItem('auth'));
//         const token = auth?.token;
//         console.log("bearer_token ", token);
//         const requestConfig = {
//             headers: {
//                 'Authorization': `Bearer ${token || ''}`, // Use the token from userInfo
//                 'Content-Type': 'application/json'
//             },
//             ...(method === 'GET' ? { params: data } : { data }), // for POST/PUT/DELETE use `data`
//         };

//         axiosMethods[method](`${window.location.origin}/api/${url}`, requestConfig)
//             .then(res => resolve(res.data))
//             .catch(err => {
//                 // if (err.response?.status === 401) {
//                 //     logoutUser(); // optional
//                 // }
//                 reject(err.response?.data || { message: err.message });
//             });
//     });
// };


export const _REQUEST_ORIGIN = (url, method, data) => {
    if (!window.navigator.onLine) return Promise.reject("You are offline, Please check your network connection");
    const userInfo = getAuth();

    return new Promise((resolve, reject) => {
        fetch(`${window.location.origin}/api/${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(userInfo?.token && { 'Authorization': `Bearer ${userInfo?.token}` })
            },
            ...(method == _REQ_METHOD.POST && { body: JSON.stringify(data) })
        })
            .then(async res => {
                if (res.status == 404) return reject({ message: 'Page not found, Please upgrade the version', code: 404 });
                else if (res.status != 200 && res.status != 201) return reject({ message: `Something went wrong. ${res.statusText}`, code: res.status })
                res = await res.json();
                if (res?.logout) {
                    if (userInfo?.token) logoutUser();
                } else if (res?.success) {
                    resolve(res)
                } else {
                    reject({ message: res?.message || 'Something went wrong', code: res?.code })
                }
            })
            .catch(err => {
                reject(err.message || 'Something went wrong')
            })
    })
}

export const convertToCSV = (data) => {
    // Extract headers from the keys of the first object
    const headers = Object.keys(data[0]).join(',');

    // Convert each row of data into a CSV row
    const rows = data.map(row =>
        Object.values(row).map(value => `"${value}"`).join(',')
    );

    // Combine headers and rows
    return `${headers}\n${rows.join('\n')}`;
};

export const downloadCSV = (data, filename = 'data.csv') => {
    // Convert data to CSV
    const csvContent = convertToCSV(data);

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Set link attributes
    link.setAttribute('href', url);
    link.setAttribute('download', filename);

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const downloadCSVByElement = (elemment, filename = 'data.csv') => {
    const table = elemment
    let csv = [];
    for (let row of table.rows) {
        let cols = Array.from(row.cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`);
        csv.push(cols.join(','));
    }

    const csvContent = csv.join('\n');
    if (table.rows.length <= 1 || csvContent.indexOf("No results found") >= 0) {
        toast("No results found", {
            type: "warning", // or "error", "info", "warning", "default"
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
        });
        return
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

