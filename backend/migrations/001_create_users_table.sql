-- Enable UUID support
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists users (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  companyName varchar not null,
  username varchar not null,
  email varchar not null unique,
  password varchar not null,
);

comment on table users is 'This table is for the clients that are registered.';
