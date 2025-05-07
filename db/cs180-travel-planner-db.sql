--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-07 16:01:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 65785)
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    activity_id integer NOT NULL,
    trip_id integer NOT NULL,
    name text NOT NULL,
    location text,
    category text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    date_created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 65784)
-- Name: activities_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_activity_id_seq OWNER TO postgres;

--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 221
-- Name: activities_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_activity_id_seq OWNED BY public.activities.activity_id;


--
-- TOC entry 220 (class 1259 OID 65770)
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    trip_id integer NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    date_created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 65769)
-- Name: trips_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trips_trip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trips_trip_id_seq OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 219
-- Name: trips_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trips_trip_id_seq OWNED BY public.trips.trip_id;


--
-- TOC entry 218 (class 1259 OID 65758)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password text NOT NULL,
    joined_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 65757)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4756 (class 2604 OID 65805)
-- Name: activities activity_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN activity_id SET DEFAULT nextval('public.activities_activity_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 65806)
-- Name: trips trip_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips ALTER COLUMN trip_id SET DEFAULT nextval('public.trips_trip_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 65807)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4918 (class 0 OID 65785)
-- Dependencies: 222
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (activity_id, trip_id, name, location, category, start_date, end_date, date_created) FROM stdin;
\.


--
-- TOC entry 4916 (class 0 OID 65770)
-- Dependencies: 220
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (trip_id, user_id, title, start_date, end_date, date_created) FROM stdin;
\.


--
-- TOC entry 4914 (class 0 OID 65758)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, first_name, last_name, password, joined_on) FROM stdin;
\.


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 221
-- Name: activities_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_activity_id_seq', 1, false);


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 219
-- Name: trips_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trips_trip_id_seq', 1, false);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 4765 (class 2606 OID 65793)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (activity_id);


--
-- TOC entry 4763 (class 2606 OID 65778)
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- TOC entry 4759 (class 2606 OID 65768)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4761 (class 2606 OID 65766)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4767 (class 2606 OID 65794)
-- Name: activities activities_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- TOC entry 4766 (class 2606 OID 65779)
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-05-07 16:01:21

--
-- PostgreSQL database dump complete
--

