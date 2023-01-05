import {mount} from "@vue/test-utils";
import AppVue from "../src/App.vue";
import CheckoutGatewayHttp from "../src/infra/gateway/CheckoutGatewayHttp";
import {beforeEach} from "vitest/browser";
import CheckoutGatewayInterface from "../src/infra/gateway/CheckoutGatewayInterface";
import Product from "../src/domain/Product";
import HttpClientAdapterAxios from "../src/infra/http/HttpClientAdapterAxios";

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

const baseUrl: string = "http://localhost:3000";
test("Deve testar pedido vazio em tela", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    expect(wrapper.get(".title").text()).toBe("Checkout");
    expect(wrapper.findAll(".product-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product-price").at(0)?.text()).toBe("R$\xa01.000,00");
    expect(wrapper.findAll(".product-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".product-price").at(1)?.text()).toBe("R$\xa05.000,00");
    expect(wrapper.findAll(".product-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".product-price").at(2)?.text()).toBe("R$\xa030,00");
    expect(wrapper.get(".total").text()).toBe("R$\xa00,00");

});

test("Deve testar pedido com um item", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("R$\xa01.000,00");
    expect(wrapper.findAll(".item-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.findAll(".item-description").at(1)?.text()).toBe(undefined);
    expect(wrapper.findAll(".item-quantity").at(1)?.text()).toBe(undefined);
});

test("Deve testar pedido com vários item", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("R$\xa06.090,00");
    expect(wrapper.findAll(".item-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.findAll(".item-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".item-quantity").at(1)?.text()).toBe("1");
    expect(wrapper.findAll(".item-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("3");
});

test("Deve testar pedido com vários item e retirar 2 unidades de C", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("R$\xa06.090,00");

    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");
    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");

    expect(wrapper.get(".total").text()).toBe("R$\xa06.030,00");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("1");
});

test("Deve testar pedido com vários item e incrementar 2 unidades de C", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("R$\xa06.090,00");

    await wrapper.findAll(".item-increase-button").at(2)?.trigger("click");
    await wrapper.findAll(".item-increase-button").at(2)?.trigger("click");

    expect(wrapper.get(".total").text()).toBe("R$\xa06.150,00");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("5");
});

test("Deve testar impedir item negativo", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("R$\xa02.000,00");

    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");
    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");
    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");
    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");

    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBeUndefined();
    expect(wrapper.get(".total").text()).toBe("R$\xa00,00");
});

test("Deve confirmar 1 item", async function () {
    const httpClient = new HttpClientAdapterAxios();
    const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".confirm").at(0)?.trigger("click");
    await sleep(500);
    expect(wrapper.findAll(".message").at(0)?.text()).toBe("Success");
    expect(wrapper.get(".order-code").text()).toBe("202300000001");
    expect(wrapper.get(".order-total").text()).toBe("R$\xa01.030,00");
});

test("Deve testar pedido vazio em tela com 4 itens", async function () {
    const checkoutGateway: CheckoutGatewayInterface = {//fake
        async checkout(input: any): Promise<any> {
            return {
                code: "202300000001",
                total: 1030
            }

        },
        async getProducts(): Promise<Product[]> {
            const products: Product[] = [];
            products.push(new Product(4, "D", 1000));
            return products
        }

    }
    const wrapper = mount(AppVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    await sleep(500);
    expect(wrapper.get(".title").text()).toBe("Checkout");
    expect(wrapper.findAll(".product-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product-price").at(0)?.text()).toBe("R$\xa01.000,00");
    expect(wrapper.findAll(".product-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".product-price").at(1)?.text()).toBe("R$\xa05.000,00");
    expect(wrapper.findAll(".product-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".product-price").at(2)?.text()).toBe("R$\xa030,00");
    expect(wrapper.findAll(".product-description").at(3)?.text()).toBe("D");
    expect(wrapper.findAll(".product-price").at(3)?.text()).toBe("R$\xa01.000,00");
    expect(wrapper.get(".total").text()).toBe("R$\xa00,00");

});