CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
)

CREATE TYPE transaction_status AS ENUM (
  'preserve',
  'complete',
  'open',
  'expired'
);

CREATE TYPE role AS ENUM (
  'administrator',
  'frontdesk',
  'house_keeping_manager',
  'house_keeping'
);

CREATE TYPE current_status AS ENUM (
  'vacant',
  'occupied',
  'maintenance',
  'off_market',
  'departing'
);

CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_details (id) NOT NULL,
  room_id UUID NOT NULL,
  price FLOAT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  display_color VARCHAR,
  transaction_status transaction_status,
  stripe_session_id VARCHAR NULL,
  createAt TIMESTAMP DEFAULT NOW(),
  createTime TIME DEFAULT NOW()
);

CREATE TABLE employee (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR UNIQUE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  password VARCHAR NOT NULL,
  role role,
  telephone VARCHAR NOT NULL,
  session_id UUID NOT NULL,
  phone_number VARCHAR NOT NULL,
);

CREATE TABLE website_config (
  logo_path VARCHAR,
  primary_color VARCHAR,
  secondary_color VARCHAR,
  hotel_name VARCHAR
);

CREATE TABLE room_type (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  detail TEXT NOT NULL,
  capacity INT NOT NULL,
  price FLOAT NOT NULL,
  picture_path VARCHAR
);

CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR NOT NULL UNIQUE,
  type_id UUID ,
  current_status current_status DEFAULT 'vacant'
);

CREATE table provinces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code  varchar(4) UNIQUE,
  name_en varchar(255)
);

CREATE table districts (
  id  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code  varchar(10) UNIQUE,
  name_en varchar(255),
  province_code VARCHAR REFERENCES provinces(code)
);

CREATE table sub_districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code  varchar(10) UNIQUE,
  name_en varchar(255),
  district_code VARCHAR REFERENCES districts(code)
);


CREATE TABLE customer_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  sub_district VARCHAR NOT NULL,
  district VARCHAR NOT NULL,
  province VARCHAR NOT NULL,
  postal_code VARCHAR NOT NULL,
  phone_number VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  special_request VARCHAR NULL,
);

ALTER TABLE room ADD FOREIGN KEY (type_id) REFERENCES room_type (id);

ALTER TABLE reservation ADD FOREIGN KEY (room_id) REFERENCES room (id);

ALTER TABLE reservation ADD FOREIGN KEY (customer_id) REFERENCES customer_detail (id);

ALTER TABLE customer_detail ADD FOREIGN KEY (province_id) REFERENCES provinces (id);

ALTER TABLE user_session ADD FOREIGN KEY (user_id) REFERENCES employee (id);
