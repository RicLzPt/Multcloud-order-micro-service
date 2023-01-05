
create table product
(
    id_product  int primary key,
    description text,
    price       real,
    width       int,
    height      int,
    length      int,
    weight      real,
    currency    text
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
    code        text primary key,
    percentage  real,
    expire_date datetime
);

insert into coupon(code, percentage, expire_date)
values ('VALE20', 20, '2022-01-31T23:59:59');
insert into coupon(code, percentage, expire_date)
values ('VALE20EXPIRED', 20, '2022-12-10T23:59:59');

create table db_order
(
    id_order          int primary key not null,
    coupon_code       text,
    coupon_percentage numeric,
    code              text,
    cpf               text,
    email             text,
    issue_date        datetime,
    freight           real,
    total             real,
    sequence          int
);

create table item
(
    id_order   int not null,
    id_product int not null,
    price      real,
    quantity   int,
    FOREIGN KEY(id_order) REFERENCES db_order(ROWID),
    FOREIGN KEY(id_product) REFERENCES product(ROWID)
);