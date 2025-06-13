import { toast } from "react-toastify";

export * from "./auth";

export const public_path = (...params) => {
    const url = params.join("/");
    return `${window.location.origin}${url.startsWith("/") ? '' : '/'}${url}`
}
export const refLink = (name = ``) => {
    return `${window.location.origin}/${name}`
}
export const upload_path = (...params) => {
    return public_path("uploads", ...params)
}
export const crypto_path = (...params) => {
    return upload_path("cryptoimages", ...params)
}
export const marketplace_path = (...params) => {
    return upload_path("marketplaces", ...params)
}
export const tempfiles_path = (...params) => {
    return marketplace_path("tempfile", ...params)
}
export const packages_path = (...params) => {
    return upload_path("packageimages", ...params)
}
export const getProdImages = (data) => {
    return new Array(5).fill(1)
        .map((_, index) => ({ index, file: data[`Image${(index + 1)}`] }))
        .filter(item => item.file);
}
export const getProdFiles = (data) => {
    return new Array(10).fill(1)
        .map((_, index) => ({ index, file: data[`File${(index + 1)}`] }))
        .filter(item => item.file);
}
export const getProdVideos = (data) => {
    return new Array(10).fill(1)
        .map((_, index) => ({ index, file: data[`Video${(index + 1)}`] }))
        .filter(item => item.file);
}
export const toast_error = (data, code) => {
    if (!data) return;
    var message = data;
    if (typeof data == 'object') {
        message = data.message;
        code = data.code || code;
        try {
            if (!message) message = data.toString();
        } catch (error) {
            message = "Unknown error";
        }
    }
    if (code) code = `error code: ${code}`;
    toast.error(`${message}`)
}
export const toast_success = (message) => {
    if (!message) return;
    toast.success(message)
}
export const toast_warning = (message) => {
    if (!message) return;
    toast.warning(message)
}
export const isUrlValid = (input) => {
    try {
        var url = new URL(input);
        return url.protocol == 'http:' || url.protocol == 'https:';
    } catch (error) {
    }
    return false;
}
export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const Navigate = ({ to }) => {
    window.location.href = `${window.location.origin}${to}`;
    return <></>
}