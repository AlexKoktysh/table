import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAyOTIxMjEsIkFwcGxpY2F0aW9uIjoiUnVrb3ZvZGl0ZWwifQ.tdUIEg-hrhP2dRQHL1r6x3raC2GZ8qu0utwrTC8zUBk";

const instance = axios.create({
    baseURL: `https://portal.liloo.by/api/integrations/services/pay_services/checkby`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});

instance.interceptors.response.use(
    (response) => response.data,
    (error) => ({ error: error.response.data }),
);

export const getProductData = async (params) => {
    const response = await instance.post("/nd_product_list", { ...params });
    return response;
};
export const getServiceData = async (params) => {
    const response = await instance.post("/service_list", { ...params });
    return response;
};