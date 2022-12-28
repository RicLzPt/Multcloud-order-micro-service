import axios from "axios/index";
import Checkout from "../src/application/Checkout";
import ProductDataDatabase from "../src/infra/data/ProductDataDatabase";
import CouponDataDatabase from "../src/infra/data/CouponDataDatabase";
import ProductDataInterface from "../src/domain/datainterface/ProductDataInterface";
import CouponDataInterface from "../src/domain/datainterface/CouponDataInterface";
import sinon from "sinon";
import CurrencyGatewayRandom from "../src/infra/gateway/CurrencyGatewayRandom";
import MailerConsole from "../src/infra/mailer/MailerConsole";
import CurrencyGatewayInterface from "../src/infra/gateway/CurrencyGatewayInterface";
import MailerInterface from "../src/infra/mailer/MailerInterface";
import OrderDataInterface from "../src/domain/datainterface/OrderDataInterface";
import Product from "../src/domain/entities/Product";
import Coupon from "../src/domain/entities/Coupon";
import Currencies from "../src/domain/entities/Currencies";


test("Não deve fazer pedido com CPF inválido no Checkout", async function () {
    const input = {
        cpf: "111.111.111-11",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<any> {
            return Promise.resolve(undefined);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            return Promise.resolve(undefined);
        }
    };
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    await expect(async () => {
        await checkout.execute(input);
    }).rejects.toThrowError("Invalid cpf");
});

test("Não deve fazer pedido com produto duplicado no Checkout", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 1, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9),
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": {code: "VALE20", percentage: 20, expire_date: new Date("2022-12-31T00:00:00")},
                "VALE20_EXPIRED": {code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-11-31T00:00:00")}
            }
            return coupons[code];
        }
    };
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    await expect(async () => {
        await checkout.execute(input);
    }).rejects.toThrowError("Duplicated product");
});

test("Deve fazer pedido com item com quantidade positiva no Checkout", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 0},
        ],
        coupon: "VALE20"
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9),
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": {code: "VALE20", percentage: 20, expire_date: new Date("2022-12-31T00:00:00")},
                "VALE20_EXPIRED": {code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-11-31T00:00:00")}
            }
            return coupons[code];
        }
    };
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    await expect(async () => {
        await checkout.execute(input);
    }).rejects.toThrowError("Quantity must be positive");
});
test("Deve testar checkout com 3 produtos com desconto", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };

    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9)
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": new Coupon("VALE20", 20, new Date("2022-12-31T00:00:00")),
                "VALE20_EXPIRED": new Coupon("VALE20_EXPIRED", 20, new Date("2022-11-31T00:00:00"))
            }
            return coupons[code];
        }

    }
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    const output = await checkout.execute(input);
    expect(output.total).toBe(5132)
});

test("Deve testar checkout com 4 produtos com moedas diferentes (Stub e Spy)", async function () {
    const currencies = new Currencies();
    currencies.addCurrency("USD", 2);
    currencies.addCurrency("BRL", 1);
    const currencyGatewayStub = sinon.stub(CurrencyGatewayRandom.prototype, "getCurrencies")
        .resolves(currencies);
    const mailerSpy = sinon.spy(MailerConsole.prototype, "send");
    const input = {
        cpf: "041.829.006-77",
        email: "ricardolpinto@gmail.com",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
            {idProduct: 4, quantity: 1},
        ]
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9),
                4: new Product(4, "D", 100, 30, 10, 10, 3, "USD")
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": {code: "VALE20", percentage: 20, expire_date: new Date("2022-12-31T00:00:00")},
                "VALE20_EXPIRED": {code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-11-31T00:00:00")}
            }
            return coupons[code];
        }

    }
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    const output = await checkout.execute(input);
    expect(output.total).toBe(6580);
    // expect(mailerSpy.calledOnce).toBeTruthy();
    // expect(mailerSpy.calledWith(input.email, "Checkout Success", "Compra Ok")).toBeTruthy();
    currencyGatewayStub.restore();
    mailerSpy.restore();
});

test("Deve testar checkout com 4 produtos com moedas diferentes (Mock)", async function () {
    const currencies = new Currencies();
    currencies.addCurrency("USD", 2);
    currencies.addCurrency("BRL", 1);
    const currencyGatewayMock = sinon.mock(CurrencyGatewayRandom.prototype);
    currencyGatewayMock.expects("getCurrencies")
        .once()
        .resolves(currencies);
    const mailerMock = sinon.mock(MailerConsole.prototype);
    mailerMock.expects("send")
        .once()
        .withArgs("ricardolpinto@gmail.com");
    const input = {
        cpf: "041.829.006-77",
        email: "ricardolpinto@gmail.com",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
            {idProduct: 4, quantity: 1},
        ]
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9),
                4: new Product(4, "D", 100, 30, 10, 10, 3, "USD")
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": {code: "VALE20", percentage: 20, expire_date: new Date("2022-12-31T00:00:00")},
                "VALE20_EXPIRED": {code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-11-31T00:00:00")}
            }
            return coupons[code];
        }

    }
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    const output = await checkout.execute(input);
    expect(output.total).toBe(6580);
    currencyGatewayMock.verify();
    currencyGatewayMock.restore();
    // mailerMock.verify();
    mailerMock.restore();
});

test("Deve testar checkout com 4 produtos e desconto com moedas diferentes (Fake)", async function () {
    const input = {
        cpf: "041.829.006-77",
        email: "ricardolpinto@gmail.com",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
            {idProduct: 4, quantity: 1},
        ]
    };
    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9),
                4: new Product(4, "D", 100, 30, 10, 10, 3, "USD")
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": {code: "VALE20", percentage: 20, expire_date: new Date("2022-12-31T00:00:00")},
                "VALE20_EXPIRED": {code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-11-31T00:00:00")}
            }
            return coupons[code];
        }
    }
    const currencyGateway: CurrencyGatewayInterface = {
        async getCurrencies(): Promise<any> {
            const currencies = new Currencies();
            currencies.addCurrency("USD", 2);
            currencies.addCurrency("BRL", 1);
            return currencies;
        }
    }
    const log: { email: string, subject: string, message: string }[] = [];
    const mailer: MailerInterface = {
        async send(email: string, subject: string, message: string): Promise<void> {
            log.push({email, subject, message});
        }
    }
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData, currencyGateway, mailer);
    const output = await checkout.execute(input);
    expect(output.total).toBe(6580);
    // expect(log).toHaveLength(1);
    // expect(log[0].email).toBe("ricardolpinto@gmail.com");
});

test("Deve testar checkout com 3 produtos com desconto e inserir o código do pedido", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };

    const productData: ProductDataInterface = {
        getProduct(idProduct: number): Promise<Product> {
            const products: {[idProduct: number]: Product} = {
                1: new Product(1, "A", 1000, 100, 30, 10, 3),
                2: new Product(2, "B", 5000, 50, 50, 50, 22),
                3: new Product(3, "C", 30, 10, 10, 10, 0.9)
            };
            return Promise.resolve(products[idProduct]);
        }
    };
    const couponData: CouponDataInterface = {
        getCoupon(code: string): Promise<any> {
            const coupons: any = {
                "VALE20": new Coupon("VALE20", 20, new Date("2022-12-31T00:00:00")),
                "VALE20_EXPIRED": new Coupon("VALE20_EXPIRED", 20, new Date("2022-11-31T00:00:00"))
            }
            return coupons[code];
        }

    }
    const orderData: OrderDataInterface = {
        count(): Promise<number> {
            return Promise.resolve(1);
        },
        getByCpf(cpf: string): Promise<any> {
            return Promise.resolve(undefined);
        },
        save(order: any): Promise<void> {
            return Promise.resolve(undefined);
        }
    }
    const checkout = new Checkout(productData, couponData, orderData);
    const output = await checkout.execute(input);
    expect(output.code).toBe("202200000001");
});