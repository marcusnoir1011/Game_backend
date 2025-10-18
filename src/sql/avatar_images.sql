create table avatar_images (
	id serial primary key,
	name varchar(100),
	image_url text,
	price int default 0,
	is_default boolean default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);