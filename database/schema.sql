DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('preserve', 'complete', 'open', 'expired');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM ('administrator', 'frontdesk', 'house_keeping_manager', 'house_keeping');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'current_status') THEN
        CREATE TYPE current_status AS ENUM ('vacant', 'occupied', 'maintenance', 'off_market', 'departing');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS customer_details (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    sub_district VARCHAR,
    district VARCHAR,
    postcode VARCHAR,
    special_request VARCHAR,
    province VARCHAR
);

CREATE TABLE IF NOT EXISTS employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR NOT NULL,
    role role,
    profile_picture VARCHAR,
    phone_number VARCHAR DEFAULT '0863102395'
);

CREATE TABLE IF NOT EXISTS reservations (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    customer_id UUID,
    room_id UUID NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    display_color VARCHAR,
    transaction_status transaction_status DEFAULT 'preserve'::public.transaction_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_DATE,
    stripe_session_id VARCHAR ,
    create_time TIME DEFAULT CURRENT_TIME
);

CREATE TABLE IF NOT EXISTS room_types (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    name VARCHAR NOT NULL,
    detail TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    picture_path VARCHAR
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    number VARCHAR NOT NULL,
    type_id UUID,
    current_status current_status DEFAULT 'vacant'::public.current_status
);

CREATE TABLE IF NOT EXISTS user_session (
    id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS website_config (
    logo_path TEXT,
    primary_color VARCHAR,
    secondary_color VARCHAR,
    hotel_name VARCHAR
);