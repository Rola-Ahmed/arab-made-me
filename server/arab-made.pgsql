--
-- PostgreSQL database dump
--

-- Dumped from database version 16rc1
-- Dumped by pg_dump version 16rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: arab-made; Type: DATABASE; Schema: -; Owner: arab-made
--

CREATE DATABASE "arab-made" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE "arab-made" OWNER TO "arab-made";

\connect -reuse-previous=on "dbname='arab-made'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_factories_verified; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_factories_verified AS ENUM (
    '0',
    '1'
);


ALTER TYPE public.enum_factories_verified OWNER TO "arab-made";

--
-- Name: enum_importers_verified; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_importers_verified AS ENUM (
    '0',
    '1'
);


ALTER TYPE public.enum_importers_verified OWNER TO "arab-made";

--
-- Name: enum_privateLabelings_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_privateLabelings_status" AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_privateLabelings_status" OWNER TO "arab-made";

--
-- Name: enum_purchasingOrders_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_purchasingOrders_status" AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_purchasingOrders_status" OWNER TO "arab-made";

--
-- Name: enum_quotationRequests_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_quotationRequests_status" AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_quotationRequests_status" OWNER TO "arab-made";

--
-- Name: enum_quotations_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_quotations_status AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public.enum_quotations_status OWNER TO "arab-made";

--
-- Name: enum_shippingCompanies_verified; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_shippingCompanies_verified" AS ENUM (
    '0',
    '1'
);


ALTER TYPE public."enum_shippingCompanies_verified" OWNER TO "arab-made";

--
-- Name: enum_sourcingOffers_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_sourcingOffers_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_sourcingOffers_status" OWNER TO "arab-made";

--
-- Name: enum_sourcingRequests_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_sourcingRequests_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_sourcingRequests_status" OWNER TO "arab-made";

--
-- Name: enum_specialManufacturingRequests_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_specialManufacturingRequests_status" AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_specialManufacturingRequests_status" OWNER TO "arab-made";

--
-- Name: enum_subscriptions_type; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_subscriptions_type AS ENUM (
    'Free',
    'Standard',
    'Gold',
    'Premium'
);


ALTER TYPE public.enum_subscriptions_type OWNER TO "arab-made";

--
-- Name: enum_users_language; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_users_language AS ENUM (
    'english',
    'arabic',
    'german',
    'french'
);


ALTER TYPE public.enum_users_language OWNER TO "arab-made";

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'importer',
    'factory',
    'user',
    'shippingCompany'
);


ALTER TYPE public.enum_users_role OWNER TO "arab-made";

--
-- Name: enum_visits_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public.enum_visits_status AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public.enum_visits_status OWNER TO "arab-made";

--
-- Name: enum_whiteLabelings_status; Type: TYPE; Schema: public; Owner: arab-made
--

CREATE TYPE public."enum_whiteLabelings_status" AS ENUM (
    'open',
    'seen',
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."enum_whiteLabelings_status" OWNER TO "arab-made";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    keywords character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sectorId" integer
);


ALTER TABLE public.categories OWNER TO "arab-made";

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO "arab-made";

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: chats; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.chats (
    id integer NOT NULL,
    messages jsonb[] DEFAULT ARRAY[]::jsonb[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userOneId" integer,
    "userTwoId" integer
);


ALTER TABLE public.chats OWNER TO "arab-made";

--
-- Name: chats_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chats_id_seq OWNER TO "arab-made";

--
-- Name: chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;


--
-- Name: contactUs; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."contactUs" (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    phone character varying(255),
    message character varying(255) NOT NULL,
    company character varying(255),
    address character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."contactUs" OWNER TO "arab-made";

--
-- Name: contactUs_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."contactUs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."contactUs_id_seq" OWNER TO "arab-made";

--
-- Name: contactUs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."contactUs_id_seq" OWNED BY public."contactUs".id;


--
-- Name: endorsements; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.endorsements (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer
);


ALTER TABLE public.endorsements OWNER TO "arab-made";

--
-- Name: endorsements_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.endorsements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.endorsements_id_seq OWNER TO "arab-made";

--
-- Name: endorsements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.endorsements_id_seq OWNED BY public.endorsements.id;


--
-- Name: factories; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.factories (
    "userId" integer NOT NULL,
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    "whyUs" text,
    "repName" character varying(50)[],
    "allowEmailNotification" boolean DEFAULT true,
    "repEmail" character varying(255),
    "repPhone" character varying(255),
    address character varying(255)[],
    "importingCountries" character varying(255)[],
    "commercialRegisterationNumber" bigint,
    "taxRegisterationNumber" bigint,
    "directorName" character varying(255),
    "directorEmail" character varying(255),
    "directorPhone" character varying(255),
    "numberOfProductonLines" integer,
    "numberOfEmployees" character varying(255),
    "qualityCertificates" character varying(255)[],
    "testLaboratory" boolean,
    "researchAndDevelopmentSection" boolean,
    "acceptManufacturingForOthers" boolean,
    "acceptSpecialOrders" boolean,
    "acceptManufacturingForSpecialBrands" boolean,
    "acceptPaymentWithArabCurriencies" boolean,
    "coverImage" character varying(255),
    images character varying(255)[],
    "legalDocs" character varying(255)[],
    "coverVideo" character varying(255),
    verified public.enum_factories_verified DEFAULT '1'::public.enum_factories_verified,
    "yearOfEstablishmint" character varying(255),
    phone character varying(255),
    "yearlySalesIncome" character varying(255),
    website character varying(255),
    country character varying(255),
    city character varying(255),
    "socialLinks" jsonb,
    "businessHours" character varying(255),
    "emailActivated" boolean DEFAULT true,
    "IndustrialRegistrationNumber" bigint,
    "IndustrialLicenseNumber" bigint,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sectorId" integer,
    "subscriptionId" integer
);


ALTER TABLE public.factories OWNER TO "arab-made";

--
-- Name: factories_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.factories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factories_id_seq OWNER TO "arab-made";

--
-- Name: factories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.factories_id_seq OWNED BY public.factories.id;


--
-- Name: importers; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.importers (
    "userId" integer NOT NULL,
    id integer NOT NULL,
    name character varying(255),
    description character varying(255) NOT NULL,
    "repName" character varying(255),
    "repEmail" character varying(255),
    "repPhone" character varying(255),
    address character varying(255)[],
    "exportingCountries" character varying(255)[],
    "commercialRegisterationNumber" bigint,
    verified public.enum_importers_verified DEFAULT '1'::public.enum_importers_verified,
    "legalDocs" character varying(255)[],
    "yearOfEstablishmint" integer,
    website character varying(255),
    country character varying(255),
    city character varying(255),
    "socialLinks" jsonb,
    "businessHours" character varying(255),
    "emailActivated" boolean DEFAULT true,
    "allowEmailNotification" boolean DEFAULT true,
    image character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sectorId" integer
);


ALTER TABLE public.importers OWNER TO "arab-made";

--
-- Name: importers_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.importers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.importers_id_seq OWNER TO "arab-made";

--
-- Name: importers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.importers_id_seq OWNED BY public.importers.id;


--
-- Name: loginTimes; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."loginTimes" (
    id integer NOT NULL,
    times integer DEFAULT 1,
    "expirationDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."loginTimes" OWNER TO "arab-made";

--
-- Name: loginTimes_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."loginTimes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."loginTimes_id_seq" OWNER TO "arab-made";

--
-- Name: loginTimes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."loginTimes_id_seq" OWNED BY public."loginTimes".id;


--
-- Name: privateLabelings; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."privateLabelings" (
    id integer NOT NULL,
    "moreDetails" character varying(255),
    "productName" character varying(255),
    status public."enum_privateLabelings_status" DEFAULT 'open'::public."enum_privateLabelings_status",
    docs character varying(255)[],
    "tradeMark" character varying(255),
    quantity integer,
    "shippingConditions" character varying(255),
    "shippingSize" character varying(255),
    "supplyLocation" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer,
    "productId" integer,
    "packingConditions" character varying(255),
    "qualityConditions" character varying(255),
    deadline timestamp with time zone
);


ALTER TABLE public."privateLabelings" OWNER TO "arab-made";

--
-- Name: privateLabelings_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."privateLabelings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."privateLabelings_id_seq" OWNER TO "arab-made";

--
-- Name: privateLabelings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."privateLabelings_id_seq" OWNED BY public."privateLabelings".id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "coverImage" character varying(255),
    "hsnCode" character varying(255) NOT NULL,
    images character varying(255)[],
    price double precision NOT NULL,
    available boolean DEFAULT true,
    "minOrderQuantity" integer,
    "maxOrderQuantity" integer,
    "specialCharacteristics" jsonb,
    guarantee character varying(255),
    "averageRate" double precision DEFAULT '0'::double precision,
    country character varying(255),
    city character varying(255),
    "leadTime" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sectorId" integer,
    "factoryId" integer,
    "categoryId" integer
);


ALTER TABLE public.products OWNER TO "arab-made";

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO "arab-made";

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: purchasingOrders; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."purchasingOrders" (
    id integer NOT NULL,
    "repName" character varying(255),
    "contactData" jsonb,
    "productId" integer,
    "productName" character varying(255),
    "sourcingOfferId" integer,
    "quotationId" integer,
    quantity integer NOT NULL,
    status public."enum_purchasingOrders_status" DEFAULT 'open'::public."enum_purchasingOrders_status",
    instructions character varying(255),
    "shippingConditions" character varying(255),
    "packingConditions" character varying(255),
    docs character varying(255)[],
    "legalStamp" character varying(255),
    "paymentTerms" character varying(255),
    "conditionsOfDelays" character varying(255),
    "estimationDelay" character varying(255),
    "timeOfManufacturingDelay" character varying(255),
    "examinationDelay" character varying(255),
    "companyQualityTesting" character varying(255),
    "timeLine" jsonb,
    "supplyLocation" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer,
    "qualityConditions" character varying(255),
    deadline timestamp with time zone,
    "shippingTypeAndSize" character varying(255)
);


ALTER TABLE public."purchasingOrders" OWNER TO "arab-made";

--
-- Name: purchasingOrders_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."purchasingOrders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."purchasingOrders_id_seq" OWNER TO "arab-made";

--
-- Name: purchasingOrders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."purchasingOrders_id_seq" OWNED BY public."purchasingOrders".id;


--
-- Name: quotationRequests; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."quotationRequests" (
    id integer NOT NULL,
    deadline timestamp with time zone,
    status public."enum_quotationRequests_status" DEFAULT 'open'::public."enum_quotationRequests_status",
    "productName" character varying(255),
    quantity integer NOT NULL,
    "shippingConditions" character varying(255) NOT NULL,
    "packingConditions" character varying(255) NOT NULL,
    "qualityConditions" character varying(255) NOT NULL,
    "paymentTerms" character varying(255) NOT NULL,
    "otherInfoRequest" character varying(255),
    docs character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "productId" integer,
    "factoryId" integer,
    "importerId" integer
);


ALTER TABLE public."quotationRequests" OWNER TO "arab-made";

--
-- Name: quotationRequests_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."quotationRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."quotationRequests_id_seq" OWNER TO "arab-made";

--
-- Name: quotationRequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."quotationRequests_id_seq" OWNED BY public."quotationRequests".id;


--
-- Name: quotations; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.quotations (
    id integer NOT NULL,
    "quotationRequestId" integer,
    "sourcingRequestId" integer,
    "specialManufacturingRequestId" integer,
    "privateLabelingId" integer,
    "productName" character varying(255),
    "minQuantity" integer,
    "requestedQuantity" integer,
    price double precision NOT NULL,
    discounts character varying(255),
    "shippingConditions" character varying(255),
    "packingConditions" character varying(255),
    "paymentTerms" character varying(255),
    "timeLine" jsonb[],
    notes character varying(255),
    status public.enum_quotations_status DEFAULT 'open'::public.enum_quotations_status,
    "qualityConditions" character varying(255),
    docs character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "importerId" integer,
    "factoryId" integer,
    "whiteLabelingId" integer,
    "shippingSize" character varying(255),
    "supplyLocation" character varying(255),
    deadline timestamp with time zone
);


ALTER TABLE public.quotations OWNER TO "arab-made";

--
-- Name: quotations_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.quotations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotations_id_seq OWNER TO "arab-made";

--
-- Name: quotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.quotations_id_seq OWNED BY public.quotations.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    comment character varying(255),
    rate integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "productId" integer,
    "importerId" integer
);


ALTER TABLE public.reviews OWNER TO "arab-made";

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO "arab-made";

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    keywords character varying(255)[],
    image character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.sectors OWNER TO "arab-made";

--
-- Name: sectors_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.sectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sectors_id_seq OWNER TO "arab-made";

--
-- Name: sectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.sectors_id_seq OWNED BY public.sectors.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    data jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public.sessions OWNER TO "arab-made";

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO "arab-made";

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: shippingCompanies; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."shippingCompanies" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    country character varying(255),
    city character varying(255),
    "repEmail" character varying(255),
    verified public."enum_shippingCompanies_verified" DEFAULT '1'::public."enum_shippingCompanies_verified",
    "emailActivated" boolean DEFAULT true,
    "legalDocs" character varying(255)[],
    "coverImage" character varying(255),
    images character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."shippingCompanies" OWNER TO "arab-made";

--
-- Name: shippingCompanies_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."shippingCompanies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."shippingCompanies_id_seq" OWNER TO "arab-made";

--
-- Name: shippingCompanies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."shippingCompanies_id_seq" OWNED BY public."shippingCompanies".id;


--
-- Name: sourcingOffers; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."sourcingOffers" (
    id integer NOT NULL,
    price double precision NOT NULL,
    "productId" integer,
    "preferredCountries" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "productName" character varying(255),
    "productDescription" character varying(255),
    "productHSNCode" character varying(255),
    quantity integer,
    "qualityConditions" character varying(255),
    "shippingConditions" character varying(255),
    "packingConditions" character varying(255),
    "paymentTerms" character varying(255),
    "deliveryTerms" character varying(255),
    status public."enum_sourcingOffers_status" DEFAULT 'pending'::public."enum_sourcingOffers_status",
    images character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "categoryId" integer
);


ALTER TABLE public."sourcingOffers" OWNER TO "arab-made";

--
-- Name: sourcingOffers_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."sourcingOffers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."sourcingOffers_id_seq" OWNER TO "arab-made";

--
-- Name: sourcingOffers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."sourcingOffers_id_seq" OWNED BY public."sourcingOffers".id;


--
-- Name: sourcingQuotations; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."sourcingQuotations" (
    id integer NOT NULL,
    price double precision NOT NULL,
    "shippingConditions" character varying(255),
    "packingConditions" character varying(255),
    "paymentTerms" character varying(255),
    docs character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sourcingRequestId" integer,
    "factoryId" integer
);


ALTER TABLE public."sourcingQuotations" OWNER TO "arab-made";

--
-- Name: sourcingQuotations_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."sourcingQuotations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."sourcingQuotations_id_seq" OWNER TO "arab-made";

--
-- Name: sourcingQuotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."sourcingQuotations_id_seq" OWNED BY public."sourcingQuotations".id;


--
-- Name: sourcingRequests; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."sourcingRequests" (
    id integer NOT NULL,
    deadline timestamp with time zone,
    status public."enum_sourcingRequests_status" DEFAULT 'pending'::public."enum_sourcingRequests_status",
    "productName" character varying(255) NOT NULL,
    "productDescription" character varying(255) NOT NULL,
    "specialCharacteristics" jsonb,
    quantity integer NOT NULL,
    "preferredCountries" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "shippingConditions" character varying(255),
    "packingConditions" character varying(255),
    "qualityConditions" character varying(255),
    "paymentTerms" character varying(255),
    "otherInfoRequest" character varying(255),
    docs character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "importerId" integer
);


ALTER TABLE public."sourcingRequests" OWNER TO "arab-made";

--
-- Name: sourcingRequests_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."sourcingRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."sourcingRequests_id_seq" OWNER TO "arab-made";

--
-- Name: sourcingRequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."sourcingRequests_id_seq" OWNED BY public."sourcingRequests".id;


--
-- Name: specialManufacturingRequests; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."specialManufacturingRequests" (
    id integer NOT NULL,
    "productName" character varying(255),
    "technicalSpecifications" character varying(255),
    "specialCharacteristics" jsonb,
    inqueries character varying(255),
    status public."enum_specialManufacturingRequests_status" DEFAULT 'open'::public."enum_specialManufacturingRequests_status",
    "packingType" character varying(255),
    "supplyLocation" character varying(255),
    docs character varying(255)[],
    "tradeMark" character varying(255),
    quantity integer,
    "shippingConditions" character varying(255),
    "shippingSize" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer,
    deadline timestamp with time zone,
    "qualityConditions" character varying(255),
    "timeLine" jsonb[]
);


ALTER TABLE public."specialManufacturingRequests" OWNER TO "arab-made";

--
-- Name: specialManufacturingRequests_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."specialManufacturingRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."specialManufacturingRequests_id_seq" OWNER TO "arab-made";

--
-- Name: specialManufacturingRequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."specialManufacturingRequests_id_seq" OWNED BY public."specialManufacturingRequests".id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public.enum_subscriptions_type,
    description character varying(255)[] NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO "arab-made";

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO "arab-made";

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: teamMembers; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."teamMembers" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(255),
    image character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer
);


ALTER TABLE public."teamMembers" OWNER TO "arab-made";

--
-- Name: teamMembers_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."teamMembers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."teamMembers_id_seq" OWNER TO "arab-made";

--
-- Name: teamMembers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."teamMembers_id_seq" OWNED BY public."teamMembers".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255)[],
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255),
    language public.enum_users_language DEFAULT 'english'::public.enum_users_language,
    "emailActivated" boolean DEFAULT true,
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role,
    "importerId" integer,
    "factoryId" integer,
    "shippingCompanyId" integer,
    logout boolean,
    "socketId" character varying(255),
    "activeTimeLimit" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO "arab-made";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "arab-made";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visits; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public.visits (
    id integer NOT NULL,
    purpose character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    status public.enum_visits_status DEFAULT 'open'::public.enum_visits_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer
);


ALTER TABLE public.visits OWNER TO "arab-made";

--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public.visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visits_id_seq OWNER TO "arab-made";

--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public.visits_id_seq OWNED BY public.visits.id;


--
-- Name: whiteLabelings; Type: TABLE; Schema: public; Owner: arab-made
--

CREATE TABLE public."whiteLabelings" (
    id integer NOT NULL,
    "moreDetails" character varying(255),
    "productName" character varying(255),
    status public."enum_whiteLabelings_status" DEFAULT 'open'::public."enum_whiteLabelings_status",
    docs character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "factoryId" integer,
    "importerId" integer,
    "productId" integer,
    quantity integer,
    "shippingConditions" character varying(255),
    "shippingSize" character varying(255),
    "supplyLocation" character varying(255),
    "packingConditions" character varying(255),
    "qualityConditions" character varying(255),
    deadline timestamp with time zone
);


ALTER TABLE public."whiteLabelings" OWNER TO "arab-made";

--
-- Name: whiteLabelings_id_seq; Type: SEQUENCE; Schema: public; Owner: arab-made
--

CREATE SEQUENCE public."whiteLabelings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."whiteLabelings_id_seq" OWNER TO "arab-made";

--
-- Name: whiteLabelings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arab-made
--

ALTER SEQUENCE public."whiteLabelings_id_seq" OWNED BY public."whiteLabelings".id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: chats id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);


--
-- Name: contactUs id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."contactUs" ALTER COLUMN id SET DEFAULT nextval('public."contactUs_id_seq"'::regclass);


--
-- Name: endorsements id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.endorsements ALTER COLUMN id SET DEFAULT nextval('public.endorsements_id_seq'::regclass);


--
-- Name: factories id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories ALTER COLUMN id SET DEFAULT nextval('public.factories_id_seq'::regclass);


--
-- Name: importers id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers ALTER COLUMN id SET DEFAULT nextval('public.importers_id_seq'::regclass);


--
-- Name: loginTimes id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."loginTimes" ALTER COLUMN id SET DEFAULT nextval('public."loginTimes_id_seq"'::regclass);


--
-- Name: privateLabelings id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."privateLabelings" ALTER COLUMN id SET DEFAULT nextval('public."privateLabelings_id_seq"'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: purchasingOrders id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders" ALTER COLUMN id SET DEFAULT nextval('public."purchasingOrders_id_seq"'::regclass);


--
-- Name: quotationRequests id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."quotationRequests" ALTER COLUMN id SET DEFAULT nextval('public."quotationRequests_id_seq"'::regclass);


--
-- Name: quotations id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations ALTER COLUMN id SET DEFAULT nextval('public.quotations_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: sectors id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors ALTER COLUMN id SET DEFAULT nextval('public.sectors_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: shippingCompanies id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies" ALTER COLUMN id SET DEFAULT nextval('public."shippingCompanies_id_seq"'::regclass);


--
-- Name: sourcingOffers id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingOffers" ALTER COLUMN id SET DEFAULT nextval('public."sourcingOffers_id_seq"'::regclass);


--
-- Name: sourcingQuotations id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingQuotations" ALTER COLUMN id SET DEFAULT nextval('public."sourcingQuotations_id_seq"'::regclass);


--
-- Name: sourcingRequests id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingRequests" ALTER COLUMN id SET DEFAULT nextval('public."sourcingRequests_id_seq"'::regclass);


--
-- Name: specialManufacturingRequests id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."specialManufacturingRequests" ALTER COLUMN id SET DEFAULT nextval('public."specialManufacturingRequests_id_seq"'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: teamMembers id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."teamMembers" ALTER COLUMN id SET DEFAULT nextval('public."teamMembers_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.visits ALTER COLUMN id SET DEFAULT nextval('public.visits_id_seq'::regclass);


--
-- Name: whiteLabelings id; Type: DEFAULT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."whiteLabelings" ALTER COLUMN id SET DEFAULT nextval('public."whiteLabelings_id_seq"'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.categories (id, name, keywords, "createdAt", "updatedAt", "sectorId") FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.chats (id, messages, "createdAt", "updatedAt", "userOneId", "userTwoId") FROM stdin;
1	{"{\\"sender\\": 1, \\"status\\": \\"pending\\", \\"message\\": \\"Hello\\", \\"reciever\\": 3}","{\\"sender\\": 3, \\"status\\": \\"pending\\", \\"message\\": \\"Hi\\", \\"reciever\\": 1}","{\\"sender\\": 1, \\"status\\": \\"pending\\", \\"message\\": \\"Hi\\", \\"reciever\\": 3}","{\\"sender\\": 3, \\"status\\": \\"pending\\", \\"message\\": \\"Hello again 88\\", \\"reciever\\": 1}"}	2024-07-21 09:56:15.11+03	2024-07-27 12:03:21.486+03	1	3
\.


--
-- Data for Name: contactUs; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."contactUs" (id, name, email, phone, message, company, address, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: endorsements; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.endorsements (id, "createdAt", "updatedAt", "factoryId", "importerId") FROM stdin;
\.


--
-- Data for Name: factories; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.factories ("userId", id, name, description, "whyUs", "repName", "allowEmailNotification", "repEmail", "repPhone", address, "importingCountries", "commercialRegisterationNumber", "taxRegisterationNumber", "directorName", "directorEmail", "directorPhone", "numberOfProductonLines", "numberOfEmployees", "qualityCertificates", "testLaboratory", "researchAndDevelopmentSection", "acceptManufacturingForOthers", "acceptSpecialOrders", "acceptManufacturingForSpecialBrands", "acceptPaymentWithArabCurriencies", "coverImage", images, "legalDocs", "coverVideo", verified, "yearOfEstablishmint", phone, "yearlySalesIncome", website, country, city, "socialLinks", "businessHours", "emailActivated", "IndustrialRegistrationNumber", "IndustrialLicenseNumber", "createdAt", "updatedAt", "sectorId", "subscriptionId") FROM stdin;
1	2	ElAraby	A detailed description of the importer company (minimum 10 characters)	\N	{Akram,Swilam}	t	kirzazekke@gufum.com	1234567890	{"123 Street Name",City,Country}	{Country1,Country2}	1234567890	1234567890	Director's Name	director@example.com	0987654321	5	100	{NULL,NULL}	t	t	t	t	t	t	\N	\N	\N	\N	1	2000	9876543210	1000000	https://example.com	Country	City	{"email": "social@example.com", "facebook": "https://www.facebook.com/example", "linkedin": "https://www.linkedin.com/company/example", "whatsapp": "010025052505", "instagram": "https://www.instagram.com/example"}	\N	t	123457	68780	2024-07-21 09:47:37.594+03	2024-07-21 09:47:37.594+03	1	\N
\.


--
-- Data for Name: importers; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.importers ("userId", id, name, description, "repName", "repEmail", "repPhone", address, "exportingCountries", "commercialRegisterationNumber", verified, "legalDocs", "yearOfEstablishmint", website, country, city, "socialLinks", "businessHours", "emailActivated", "allowEmailNotification", image, "createdAt", "updatedAt", "sectorId") FROM stdin;
3	1	Importer Company Name	A detailed description of the importer company	Representative Name	representative@example.com	1234567890	{"123 Street Name",City,Country}	{Country1,Country2}	1234567890	1	\N	\N	https://example.com	Country	City	{"facebook": "https://www.facebook.com/example", "linkedin": "https://www.linkedin.com/company/example", "instagram": "https://www.instagram.com/example"}	\N	t	t	\N	2024-07-21 09:50:02.078+03	2024-07-21 09:50:02.078+03	1
\.


--
-- Data for Name: loginTimes; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."loginTimes" (id, times, "expirationDate", "createdAt", "updatedAt", "userId") FROM stdin;
1	1	2024-07-21 09:48:26.118+03	2024-07-21 09:46:26.116+03	2024-07-21 09:46:26.116+03	2
\.


--
-- Data for Name: privateLabelings; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."privateLabelings" (id, "moreDetails", "productName", status, docs, "tradeMark", quantity, "shippingConditions", "shippingSize", "supplyLocation", "createdAt", "updatedAt", "factoryId", "importerId", "productId", "packingConditions", "qualityConditions", deadline) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.products (id, name, description, "coverImage", "hsnCode", images, price, available, "minOrderQuantity", "maxOrderQuantity", "specialCharacteristics", guarantee, "averageRate", country, city, "leadTime", "createdAt", "updatedAt", "sectorId", "factoryId", "categoryId") FROM stdin;
\.


--
-- Data for Name: purchasingOrders; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."purchasingOrders" (id, "repName", "contactData", "productId", "productName", "sourcingOfferId", "quotationId", quantity, status, instructions, "shippingConditions", "packingConditions", docs, "legalStamp", "paymentTerms", "conditionsOfDelays", "estimationDelay", "timeOfManufacturingDelay", "examinationDelay", "companyQualityTesting", "timeLine", "supplyLocation", "createdAt", "updatedAt", "factoryId", "importerId", "qualityConditions", deadline, "shippingTypeAndSize") FROM stdin;
\.


--
-- Data for Name: quotationRequests; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."quotationRequests" (id, deadline, status, "productName", quantity, "shippingConditions", "packingConditions", "qualityConditions", "paymentTerms", "otherInfoRequest", docs, "createdAt", "updatedAt", "productId", "factoryId", "importerId") FROM stdin;
\.


--
-- Data for Name: quotations; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.quotations (id, "quotationRequestId", "sourcingRequestId", "specialManufacturingRequestId", "privateLabelingId", "productName", "minQuantity", "requestedQuantity", price, discounts, "shippingConditions", "packingConditions", "paymentTerms", "timeLine", notes, status, "qualityConditions", docs, "createdAt", "updatedAt", "importerId", "factoryId", "whiteLabelingId", "shippingSize", "supplyLocation", deadline) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.reviews (id, comment, rate, "createdAt", "updatedAt", "productId", "importerId") FROM stdin;
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.sectors (id, name, keywords, image, "createdAt", "updatedAt") FROM stdin;
1	Chemical Industry	{acid,petrochemicals,chemical,chemicals}	\N	2024-07-21 09:47:27.493+03	2024-07-21 09:47:27.493+03
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.sessions (id, data, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: shippingCompanies; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."shippingCompanies" (id, name, description, country, city, "repEmail", verified, "emailActivated", "legalDocs", "coverImage", images, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: sourcingOffers; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."sourcingOffers" (id, price, "productId", "preferredCountries", "productName", "productDescription", "productHSNCode", quantity, "qualityConditions", "shippingConditions", "packingConditions", "paymentTerms", "deliveryTerms", status, images, "createdAt", "updatedAt", "factoryId", "categoryId") FROM stdin;
\.


--
-- Data for Name: sourcingQuotations; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."sourcingQuotations" (id, price, "shippingConditions", "packingConditions", "paymentTerms", docs, "createdAt", "updatedAt", "sourcingRequestId", "factoryId") FROM stdin;
\.


--
-- Data for Name: sourcingRequests; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."sourcingRequests" (id, deadline, status, "productName", "productDescription", "specialCharacteristics", quantity, "preferredCountries", "shippingConditions", "packingConditions", "qualityConditions", "paymentTerms", "otherInfoRequest", docs, "createdAt", "updatedAt", "importerId") FROM stdin;
\.


--
-- Data for Name: specialManufacturingRequests; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."specialManufacturingRequests" (id, "productName", "technicalSpecifications", "specialCharacteristics", inqueries, status, "packingType", "supplyLocation", docs, "tradeMark", quantity, "shippingConditions", "shippingSize", "createdAt", "updatedAt", "factoryId", "importerId", deadline, "qualityConditions", "timeLine") FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.subscriptions (id, name, type, description, price, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teamMembers; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."teamMembers" (id, name, role, image, "createdAt", "updatedAt", "factoryId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.users (id, name, email, password, phone, language, "emailActivated", role, "importerId", "factoryId", "shippingCompanyId", logout, "socketId", "activeTimeLimit", "createdAt", "updatedAt") FROM stdin;
2	{akram," ",swilam}	admin@arab-made.com	$2b$09$SL420zQ9VQ4y.rtuKLXj8uNA9xUw2l8E4NUUcoRh0ADcRC2N.F6Lm	0100055	english	t	admin	\N	\N	\N	\N	\N	2024-07-26 09:45:15.084+03	2024-07-21 09:45:15.071+03	2024-07-21 09:45:15.071+03
3	\N	importer@arab-made.com	$2b$09$ucYe2zV9TGIvu2gMVZbdCuxqdIufsEiR5Pzd1ubwq53HDpz/ByZ/O	\N	english	t	importer	1	\N	\N	\N	gPng7vLNpsYVegfPAAAD	2024-07-26 09:49:09.831+03	2024-07-21 09:49:09.83+03	2024-07-21 10:34:47.035+03
1	\N	factory@arab-made.com	$2b$09$hmvUEQYl3XwOpX92lyi78ee0YelcZ2R58TPjTqYQ2yP7c.EPUurN6	\N	english	t	factory	\N	2	\N	\N	fiIcUXAsHtyxxcXIAAAB	2024-07-26 09:42:55.512+03	2024-07-21 09:42:55.502+03	2024-07-27 12:02:25.795+03
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public.visits (id, purpose, date, status, "createdAt", "updatedAt", "factoryId", "importerId") FROM stdin;
\.


--
-- Data for Name: whiteLabelings; Type: TABLE DATA; Schema: public; Owner: arab-made
--

COPY public."whiteLabelings" (id, "moreDetails", "productName", status, docs, "createdAt", "updatedAt", "factoryId", "importerId", "productId", quantity, "shippingConditions", "shippingSize", "supplyLocation", "packingConditions", "qualityConditions", deadline) FROM stdin;
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.chats_id_seq', 1, true);


--
-- Name: contactUs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."contactUs_id_seq"', 1, false);


--
-- Name: endorsements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.endorsements_id_seq', 1, false);


--
-- Name: factories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.factories_id_seq', 2, true);


--
-- Name: importers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.importers_id_seq', 1, true);


--
-- Name: loginTimes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."loginTimes_id_seq"', 1, true);


--
-- Name: privateLabelings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."privateLabelings_id_seq"', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: purchasingOrders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."purchasingOrders_id_seq"', 1, false);


--
-- Name: quotationRequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."quotationRequests_id_seq"', 1, false);


--
-- Name: quotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.quotations_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: sectors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.sectors_id_seq', 1, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);


--
-- Name: shippingCompanies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."shippingCompanies_id_seq"', 1, false);


--
-- Name: sourcingOffers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."sourcingOffers_id_seq"', 1, false);


--
-- Name: sourcingQuotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."sourcingQuotations_id_seq"', 1, false);


--
-- Name: sourcingRequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."sourcingRequests_id_seq"', 1, false);


--
-- Name: specialManufacturingRequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."specialManufacturingRequests_id_seq"', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: teamMembers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."teamMembers_id_seq"', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public.visits_id_seq', 1, false);


--
-- Name: whiteLabelings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arab-made
--

SELECT pg_catalog.setval('public."whiteLabelings_id_seq"', 1, false);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_name_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key1 UNIQUE (name);


--
-- Name: categories categories_name_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key10 UNIQUE (name);


--
-- Name: categories categories_name_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key11 UNIQUE (name);


--
-- Name: categories categories_name_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key12 UNIQUE (name);


--
-- Name: categories categories_name_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key13 UNIQUE (name);


--
-- Name: categories categories_name_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key14 UNIQUE (name);


--
-- Name: categories categories_name_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key15 UNIQUE (name);


--
-- Name: categories categories_name_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key16 UNIQUE (name);


--
-- Name: categories categories_name_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key17 UNIQUE (name);


--
-- Name: categories categories_name_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key18 UNIQUE (name);


--
-- Name: categories categories_name_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key19 UNIQUE (name);


--
-- Name: categories categories_name_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key2 UNIQUE (name);


--
-- Name: categories categories_name_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key20 UNIQUE (name);


--
-- Name: categories categories_name_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key21 UNIQUE (name);


--
-- Name: categories categories_name_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key22 UNIQUE (name);


--
-- Name: categories categories_name_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key23 UNIQUE (name);


--
-- Name: categories categories_name_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key24 UNIQUE (name);


--
-- Name: categories categories_name_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key25 UNIQUE (name);


--
-- Name: categories categories_name_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key26 UNIQUE (name);


--
-- Name: categories categories_name_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key27 UNIQUE (name);


--
-- Name: categories categories_name_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key28 UNIQUE (name);


--
-- Name: categories categories_name_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key29 UNIQUE (name);


--
-- Name: categories categories_name_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key3 UNIQUE (name);


--
-- Name: categories categories_name_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key30 UNIQUE (name);


--
-- Name: categories categories_name_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key31 UNIQUE (name);


--
-- Name: categories categories_name_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key32 UNIQUE (name);


--
-- Name: categories categories_name_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key33 UNIQUE (name);


--
-- Name: categories categories_name_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key34 UNIQUE (name);


--
-- Name: categories categories_name_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key35 UNIQUE (name);


--
-- Name: categories categories_name_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key36 UNIQUE (name);


--
-- Name: categories categories_name_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key37 UNIQUE (name);


--
-- Name: categories categories_name_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key38 UNIQUE (name);


--
-- Name: categories categories_name_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key39 UNIQUE (name);


--
-- Name: categories categories_name_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key4 UNIQUE (name);


--
-- Name: categories categories_name_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key40 UNIQUE (name);


--
-- Name: categories categories_name_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key5 UNIQUE (name);


--
-- Name: categories categories_name_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key6 UNIQUE (name);


--
-- Name: categories categories_name_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key7 UNIQUE (name);


--
-- Name: categories categories_name_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key8 UNIQUE (name);


--
-- Name: categories categories_name_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key9 UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: contactUs contactUs_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."contactUs"
    ADD CONSTRAINT "contactUs_pkey" PRIMARY KEY (id);


--
-- Name: endorsements endorsements_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.endorsements
    ADD CONSTRAINT endorsements_pkey PRIMARY KEY (id);


--
-- Name: factories factories_directorEmail_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key1" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key10" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key11" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key12" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key13" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key14" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key15" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key16" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key17" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key18" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key19" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key2" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key20" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key21" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key22" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key23" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key24" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key25" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key26" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key27" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key28" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key29" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key3" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key30" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key31" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key32" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key33" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key34" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key35" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key36" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key37" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key38" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key39" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key4" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key40" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key41; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key41" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key42; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key42" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key5" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key6" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key7" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key8" UNIQUE ("directorEmail");


--
-- Name: factories factories_directorEmail_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_directorEmail_key9" UNIQUE ("directorEmail");


--
-- Name: factories factories_name_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key UNIQUE (name);


--
-- Name: factories factories_name_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key1 UNIQUE (name);


--
-- Name: factories factories_name_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key10 UNIQUE (name);


--
-- Name: factories factories_name_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key11 UNIQUE (name);


--
-- Name: factories factories_name_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key12 UNIQUE (name);


--
-- Name: factories factories_name_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key13 UNIQUE (name);


--
-- Name: factories factories_name_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key14 UNIQUE (name);


--
-- Name: factories factories_name_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key15 UNIQUE (name);


--
-- Name: factories factories_name_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key16 UNIQUE (name);


--
-- Name: factories factories_name_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key17 UNIQUE (name);


--
-- Name: factories factories_name_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key18 UNIQUE (name);


--
-- Name: factories factories_name_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key19 UNIQUE (name);


--
-- Name: factories factories_name_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key2 UNIQUE (name);


--
-- Name: factories factories_name_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key20 UNIQUE (name);


--
-- Name: factories factories_name_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key21 UNIQUE (name);


--
-- Name: factories factories_name_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key22 UNIQUE (name);


--
-- Name: factories factories_name_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key23 UNIQUE (name);


--
-- Name: factories factories_name_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key24 UNIQUE (name);


--
-- Name: factories factories_name_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key25 UNIQUE (name);


--
-- Name: factories factories_name_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key26 UNIQUE (name);


--
-- Name: factories factories_name_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key27 UNIQUE (name);


--
-- Name: factories factories_name_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key28 UNIQUE (name);


--
-- Name: factories factories_name_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key29 UNIQUE (name);


--
-- Name: factories factories_name_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key3 UNIQUE (name);


--
-- Name: factories factories_name_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key30 UNIQUE (name);


--
-- Name: factories factories_name_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key31 UNIQUE (name);


--
-- Name: factories factories_name_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key32 UNIQUE (name);


--
-- Name: factories factories_name_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key33 UNIQUE (name);


--
-- Name: factories factories_name_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key34 UNIQUE (name);


--
-- Name: factories factories_name_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key35 UNIQUE (name);


--
-- Name: factories factories_name_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key36 UNIQUE (name);


--
-- Name: factories factories_name_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key37 UNIQUE (name);


--
-- Name: factories factories_name_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key38 UNIQUE (name);


--
-- Name: factories factories_name_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key39 UNIQUE (name);


--
-- Name: factories factories_name_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key4 UNIQUE (name);


--
-- Name: factories factories_name_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key40 UNIQUE (name);


--
-- Name: factories factories_name_key41; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key41 UNIQUE (name);


--
-- Name: factories factories_name_key42; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key42 UNIQUE (name);


--
-- Name: factories factories_name_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key5 UNIQUE (name);


--
-- Name: factories factories_name_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key6 UNIQUE (name);


--
-- Name: factories factories_name_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key7 UNIQUE (name);


--
-- Name: factories factories_name_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key8 UNIQUE (name);


--
-- Name: factories factories_name_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_name_key9 UNIQUE (name);


--
-- Name: factories factories_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT factories_pkey PRIMARY KEY (id);


--
-- Name: factories factories_userId_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_userId_key" UNIQUE ("userId");


--
-- Name: importers importers_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT importers_pkey PRIMARY KEY (id);


--
-- Name: importers importers_repEmail_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key1" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key10" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key11" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key12" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key13" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key14" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key15" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key16" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key17" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key18" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key19" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key2" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key20" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key21" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key22" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key23" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key24" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key25" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key26" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key27" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key28" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key29" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key3" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key30" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key31" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key32" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key33" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key34" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key35" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key36" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key37" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key4" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key5" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key6" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key7" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key8" UNIQUE ("repEmail");


--
-- Name: importers importers_repEmail_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_repEmail_key9" UNIQUE ("repEmail");


--
-- Name: importers importers_userId_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_userId_key" UNIQUE ("userId");


--
-- Name: loginTimes loginTimes_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."loginTimes"
    ADD CONSTRAINT "loginTimes_pkey" PRIMARY KEY (id);


--
-- Name: privateLabelings privateLabelings_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."privateLabelings"
    ADD CONSTRAINT "privateLabelings_pkey" PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchasingOrders purchasingOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_pkey" PRIMARY KEY (id);


--
-- Name: quotationRequests quotationRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."quotationRequests"
    ADD CONSTRAINT "quotationRequests_pkey" PRIMARY KEY (id);


--
-- Name: quotations quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sectors sectors_name_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key UNIQUE (name);


--
-- Name: sectors sectors_name_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key1 UNIQUE (name);


--
-- Name: sectors sectors_name_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key10 UNIQUE (name);


--
-- Name: sectors sectors_name_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key11 UNIQUE (name);


--
-- Name: sectors sectors_name_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key12 UNIQUE (name);


--
-- Name: sectors sectors_name_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key13 UNIQUE (name);


--
-- Name: sectors sectors_name_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key14 UNIQUE (name);


--
-- Name: sectors sectors_name_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key15 UNIQUE (name);


--
-- Name: sectors sectors_name_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key16 UNIQUE (name);


--
-- Name: sectors sectors_name_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key17 UNIQUE (name);


--
-- Name: sectors sectors_name_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key18 UNIQUE (name);


--
-- Name: sectors sectors_name_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key19 UNIQUE (name);


--
-- Name: sectors sectors_name_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key2 UNIQUE (name);


--
-- Name: sectors sectors_name_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key20 UNIQUE (name);


--
-- Name: sectors sectors_name_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key21 UNIQUE (name);


--
-- Name: sectors sectors_name_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key22 UNIQUE (name);


--
-- Name: sectors sectors_name_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key23 UNIQUE (name);


--
-- Name: sectors sectors_name_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key24 UNIQUE (name);


--
-- Name: sectors sectors_name_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key25 UNIQUE (name);


--
-- Name: sectors sectors_name_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key26 UNIQUE (name);


--
-- Name: sectors sectors_name_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key27 UNIQUE (name);


--
-- Name: sectors sectors_name_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key28 UNIQUE (name);


--
-- Name: sectors sectors_name_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key29 UNIQUE (name);


--
-- Name: sectors sectors_name_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key3 UNIQUE (name);


--
-- Name: sectors sectors_name_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key30 UNIQUE (name);


--
-- Name: sectors sectors_name_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key31 UNIQUE (name);


--
-- Name: sectors sectors_name_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key32 UNIQUE (name);


--
-- Name: sectors sectors_name_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key33 UNIQUE (name);


--
-- Name: sectors sectors_name_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key34 UNIQUE (name);


--
-- Name: sectors sectors_name_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key35 UNIQUE (name);


--
-- Name: sectors sectors_name_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key36 UNIQUE (name);


--
-- Name: sectors sectors_name_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key37 UNIQUE (name);


--
-- Name: sectors sectors_name_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key38 UNIQUE (name);


--
-- Name: sectors sectors_name_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key39 UNIQUE (name);


--
-- Name: sectors sectors_name_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key4 UNIQUE (name);


--
-- Name: sectors sectors_name_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key40 UNIQUE (name);


--
-- Name: sectors sectors_name_key41; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key41 UNIQUE (name);


--
-- Name: sectors sectors_name_key42; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key42 UNIQUE (name);


--
-- Name: sectors sectors_name_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key5 UNIQUE (name);


--
-- Name: sectors sectors_name_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key6 UNIQUE (name);


--
-- Name: sectors sectors_name_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key7 UNIQUE (name);


--
-- Name: sectors sectors_name_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key8 UNIQUE (name);


--
-- Name: sectors sectors_name_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key9 UNIQUE (name);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: shippingCompanies shippingCompanies_name_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key1" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key10" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key11" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key12" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key13" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key14" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key15" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key16" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key17" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key18" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key19" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key2" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key20" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key21" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key22" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key23" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key24" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key25" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key26" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key27" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key28" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key29" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key3" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key30" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key31" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key32" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key33" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key34" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key4" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key5" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key6" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key7" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key8" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_name_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_name_key9" UNIQUE (name);


--
-- Name: shippingCompanies shippingCompanies_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_pkey" PRIMARY KEY (id);


--
-- Name: sourcingOffers sourcingOffers_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingOffers"
    ADD CONSTRAINT "sourcingOffers_pkey" PRIMARY KEY (id);


--
-- Name: sourcingQuotations sourcingQuotations_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingQuotations"
    ADD CONSTRAINT "sourcingQuotations_pkey" PRIMARY KEY (id);


--
-- Name: sourcingRequests sourcingRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingRequests"
    ADD CONSTRAINT "sourcingRequests_pkey" PRIMARY KEY (id);


--
-- Name: specialManufacturingRequests specialManufacturingRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."specialManufacturingRequests"
    ADD CONSTRAINT "specialManufacturingRequests_pkey" PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_name_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key1 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key10 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key11 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key12 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key13 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key14 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key15 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key16 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key17 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key18 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key19 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key2 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key20 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key21 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key22 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key23 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key24 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key25 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key26 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key27 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key28 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key29 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key3 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key30 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key31 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key32 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key33 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key34 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key35 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key36 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key37 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key38 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key39 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key4 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key40 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key41; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key41 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key42; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key42 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key5 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key6 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key7 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key8 UNIQUE (name);


--
-- Name: subscriptions subscriptions_name_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_name_key9 UNIQUE (name);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: teamMembers teamMembers_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."teamMembers"
    ADD CONSTRAINT "teamMembers_pkey" PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: whiteLabelings whiteLabelings_pkey; Type: CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."whiteLabelings"
    ADD CONSTRAINT "whiteLabelings_pkey" PRIMARY KEY (id);


--
-- Name: categories categories_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chats chats_userOneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "chats_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: chats chats_userTwoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "chats_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: endorsements endorsements_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.endorsements
    ADD CONSTRAINT "endorsements_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: endorsements endorsements_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.endorsements
    ADD CONSTRAINT "endorsements_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: factories factories_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: factories factories_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: factories factories_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.factories
    ADD CONSTRAINT "factories_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: importers importers_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: importers importers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.importers
    ADD CONSTRAINT "importers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: loginTimes loginTimes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."loginTimes"
    ADD CONSTRAINT "loginTimes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: privateLabelings privateLabelings_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."privateLabelings"
    ADD CONSTRAINT "privateLabelings_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: privateLabelings privateLabelings_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."privateLabelings"
    ADD CONSTRAINT "privateLabelings_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: privateLabelings privateLabelings_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."privateLabelings"
    ADD CONSTRAINT "privateLabelings_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchasingOrders purchasingOrders_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchasingOrders purchasingOrders_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchasingOrders purchasingOrders_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchasingOrders purchasingOrders_quotationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES public.quotations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchasingOrders purchasingOrders_sourcingOfferId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."purchasingOrders"
    ADD CONSTRAINT "purchasingOrders_sourcingOfferId_fkey" FOREIGN KEY ("sourcingOfferId") REFERENCES public."sourcingOffers"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotationRequests quotationRequests_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."quotationRequests"
    ADD CONSTRAINT "quotationRequests_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotationRequests quotationRequests_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."quotationRequests"
    ADD CONSTRAINT "quotationRequests_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotationRequests quotationRequests_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."quotationRequests"
    ADD CONSTRAINT "quotationRequests_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_privateLabelingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_privateLabelingId_fkey" FOREIGN KEY ("privateLabelingId") REFERENCES public."privateLabelings"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_quotationRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_quotationRequestId_fkey" FOREIGN KEY ("quotationRequestId") REFERENCES public."quotationRequests"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_sourcingRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_sourcingRequestId_fkey" FOREIGN KEY ("sourcingRequestId") REFERENCES public."sourcingRequests"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_specialManufacturingRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_specialManufacturingRequestId_fkey" FOREIGN KEY ("specialManufacturingRequestId") REFERENCES public."specialManufacturingRequests"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotations quotations_whiteLabelingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT "quotations_whiteLabelingId_fkey" FOREIGN KEY ("whiteLabelingId") REFERENCES public."whiteLabelings"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reviews reviews_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reviews reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shippingCompanies shippingCompanies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."shippingCompanies"
    ADD CONSTRAINT "shippingCompanies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sourcingOffers sourcingOffers_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingOffers"
    ADD CONSTRAINT "sourcingOffers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sourcingOffers sourcingOffers_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingOffers"
    ADD CONSTRAINT "sourcingOffers_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sourcingOffers sourcingOffers_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingOffers"
    ADD CONSTRAINT "sourcingOffers_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sourcingQuotations sourcingQuotations_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingQuotations"
    ADD CONSTRAINT "sourcingQuotations_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sourcingQuotations sourcingQuotations_sourcingRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingQuotations"
    ADD CONSTRAINT "sourcingQuotations_sourcingRequestId_fkey" FOREIGN KEY ("sourcingRequestId") REFERENCES public."sourcingRequests"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sourcingRequests sourcingRequests_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."sourcingRequests"
    ADD CONSTRAINT "sourcingRequests_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: specialManufacturingRequests specialManufacturingRequests_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."specialManufacturingRequests"
    ADD CONSTRAINT "specialManufacturingRequests_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: specialManufacturingRequests specialManufacturingRequests_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."specialManufacturingRequests"
    ADD CONSTRAINT "specialManufacturingRequests_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teamMembers teamMembers_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."teamMembers"
    ADD CONSTRAINT "teamMembers_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visits visits_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visits visits_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: whiteLabelings whiteLabelings_factoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."whiteLabelings"
    ADD CONSTRAINT "whiteLabelings_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES public.factories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: whiteLabelings whiteLabelings_importerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."whiteLabelings"
    ADD CONSTRAINT "whiteLabelings_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES public.importers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: whiteLabelings whiteLabelings_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arab-made
--

ALTER TABLE ONLY public."whiteLabelings"
    ADD CONSTRAINT "whiteLabelings_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

