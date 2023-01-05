drop database if exists branas9;
create database branas9;

use branas9;

create table product
(
    id_product  int primary key not null auto_increment,
    description char(255),
    price       decimal(10, 2),
    width       int,
    height      int,
    length      int,
    weight      decimal(10, 2),
    currency    char(255)
);

insert into product(id_product, description, price, width, height, length, weight, currency)
values (1, 'A', 1000, 100, 30, 10, 3, 'BRL');
insert into product(id_product, description, price, width, height, length, weight, currency)
values (2, 'B', 5000, 50, 50, 50, 22, 'BRL');
insert into product(id_product, description, price, width, height, length, weight, currency)
values (3, 'C', 30, 10, 10, 10, 0.9, 'BRL');
insert into product(id_product, description, price, width, height, length, weight, currency)
values (4, 'D', 100, 100, 30, 10, 3, 'USD');

create table coupon
(
    code        char(255) primary key,
    percentage  decimal(10, 2),
    expire_date datetime
);

insert into coupon(code, percentage, expire_date)
values ('VALE20', 20, '2023-05-31T23:59:59');
insert into coupon(code, percentage, expire_date)
values ('VALE20EXPIRED', 20, '2022-12-10T23:59:59');

create table db_order
(
    id_order          int primary key not null auto_increment,
    coupon_code       char(255),
    coupon_percentage decimal(10, 2),
    code              char(255),
    cpf               char(255),
    email             char(255),
    issue_date        datetime,
    freight           decimal(10, 2),
    total             decimal(10, 2),
    sequence          int
);

create table item
(
    id_order   int not null,
    id_product int not null,
    price      decimal(10, 2),
    quantity   int,
    key fk_id_order_idx (id_order),
    key fk_id_product_idx (`id_product`),
    constraint fk_id_order foreign key (id_order) references db_order (id_order),
    constraint fk_id_product foreign key (id_product) references product (id_product)
);

create table zipcode
(
    `code`         char(255) primary key not null,
    street       char(255),
    neighborhood char(255),
    lat          decimal(11, 8),
    `long`         decimal(11, 8)
);

insert into zipcode (`code`, street, neighborhood, lat, `long`) values ('22030060', '', '', -27.5945, -48.5477);
insert into zipcode (`code`, street, neighborhood, lat, `long`) values ('88015600', '', '', -22.9129, -43.2003);