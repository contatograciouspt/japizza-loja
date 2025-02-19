import requests from "./httpServices";

const OrderServices = {
  addOrder: async (body, headers) => {
    return requests.post("/order/add", body, headers);
  },

  createPaymentIntent: async (body) => {
    return requests.post("/order/create-payment-intent", body);
  },

  addRazorpayOrder: async (body) => {
    return requests.post("/order/add/razorpay", body);
  },

  createOrderByRazorPay: async (body) => {
    return requests.post("/order/create/razorpay", body);
  },

  getOrderCustomer: async ({ page = 1, limit = 8 }) => {
    return requests.get(`/order?limit=${limit}&page=${page}`);
  },
  getOrderById: async (id, body) => {
    return requests.get(`/order/${id}`, body);
  },

  getOrderByEmail: async (email) => {
    return requests.get(`/order/email/${email}`);
  },

  //for sending email invoice to customer
  sendEmailInvoiceToCustomer: async (body) => {
    return requests.post("/order/customer/invoice", body);
  },

  // buscar todos os pedidos feitos do cliente
  getAllCustomOrdersForCustomer: async () => {
    return requests.get("/order/customer/all");
  }
};

export default OrderServices;
