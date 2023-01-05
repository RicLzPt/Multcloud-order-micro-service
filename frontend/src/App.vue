<script setup lang="ts">
import {inject, onMounted, reactive, ref} from "vue";
import axios from "axios";
import Order from "./domain/Order";
import CheckoutGatewayHttp from "./infra/gateway/CheckoutGatewayHttp";
import CheckoutGatewayInterface from "./infra/gateway/CheckoutGatewayInterface";

const products = reactive([
  {idProduct: 1, description: "A", price: 1000},
  {idProduct: 2, description: "B", price: 5000},
  {idProduct: 3, description: "C", price: 30}
]);

const order = reactive(new Order("041.829.006-77"));

const message = ref("");


const getProductById = function (idProduct: number): any {
  return products.find((product: any) => product.idProduct === idProduct);
}

const formatMoney = function (amount: number) {
  return new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(amount);
}

// const checkoutGateway = new CheckoutGatewayHttp();
const checkoutGateway = inject("checkoutGateway") as CheckoutGatewayInterface;

const confirm = async function (order: any) {
  // const response = await axios.post("http://localhost:3000/checkout", order);
  // const orderData = response.data;
  const orderData = await checkoutGateway.checkout(order);
  message.value = "Success";
  order.code = orderData.code;
  order.total = orderData.total;
}

onMounted(async () => {
  // const response = await axios.get("http://localhost:3000/products");
  // const productData = response.data;
  const productData = await checkoutGateway.getProducts();
  products.push(...productData);
});

</script>

<template>
  <div class="title">Checkout</div>
  <div v-for="product in products">
    <span class="product-description">{{ product.description }}</span>
    <span class="product-price">{{ formatMoney(product.price) }}</span>
    <button class="product-add-button" @click="order.addItem(product)">add</button>
  </div>
  <div class="total">{{ formatMoney(order.getTotal()) }}</div>
  <div v-for="item in order.items">
    <span class="item-description">{{ getProductById(item.idProduct)?.description }}</span>
    <span class="item-quantity">{{ item.quantity }}</span>
    <button class="item-increase-button" @click="order.increaseItem(item)">+</button>
    <button class="item-decrease-button" @click="order.decreaseItem(item)">-</button>
  </div>
  <button class="confirm" @click="confirm(order)">Confirmar</button>
  <div class="message">{{ message }}</div>
  <div class="order-code">{{ order.code }}</div>
  <div class="order-total">{{ formatMoney(order.total) }}</div>
</template>

<style scoped>

</style>
