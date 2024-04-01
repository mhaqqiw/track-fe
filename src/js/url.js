import { message } from "ant-design-vue";

export const HOST = "https://qada.me/passport/";

export const API_URL = 'https://qada.me/lacak/api/v1/product';

export const ADDRESS = API_URL + '/address';
export const POSTAL = API_URL + '/postal';
export const KANIM = API_URL + '/kanim';
export const SEND = API_URL + '/send';
export const ORDER = API_URL + '/order';
export const PRODUCT = API_URL + '/product';
export const ADDITIONAL = API_URL + '/additional';
export const PAYMENT = API_URL + '/payment';

export const customFetch = (url, options, meta) => {
    return fetch(url, options)
      .then((response) => handleResponse(response, meta))
      .catch((error) => handleNetworkError(error));
  };
  
  const handleResponse = (response, meta) => {
    let data = response.json();
    if (response.redirected) {
      window.location.href = response.url;
      return;
    } else if (response.ok && response.status === 200) {
      return data;
    } else if (response.status === 401 && meta.need_login) {
      window.location.href = "/login?=redirect_url=" + window.location.href;
      return Promise.reject(data);
    }
    data.then((val) => {
      if (typeof val.data === "string") {
        message.error(val.data);
      } else {
        message.error(JSON.stringify(val.data));
      }
      return;
    });
  };
  
  const handleNetworkError = (error) => {
    return Promise.reject(error); // Return the rejected promise
  };