create table users (
  id integer primary key autoincrement,
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at integer not null default (unixepoch())
);

create index users_email_idx on users (email);
