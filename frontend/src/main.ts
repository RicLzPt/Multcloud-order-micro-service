import {createApp, h} from 'vue'
import './style.css'
import App from './App.vue'
import CheckoutGatewayHttp from "./infra/gateway/CheckoutGatewayHttp";
import HttpClientAdapterAxios from "./infra/http/HttpClientAdapterAxios";
import HttpClientAdapterFetch from "./infra/http/HttpClientAdapterFetch";

const app = createApp(App);
const httpClient = new HttpClientAdapterFetch();
// const httpClient = new HttpClientAdapterAxios();
const baseUrl = "http://localhost:3000";
const checkout = new CheckoutGatewayHttp(httpClient, baseUrl);
app.provide("checkoutGateway", checkout);
app.mount('#app');
