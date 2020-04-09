CREATE TABLE public.user (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  email citext NOT NULL UNIQUE,
  pass_hash varchar NOT NULL,
  create_time timestamp without time zone NOT NULL,
  update_time timestamp without time zone NOT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

