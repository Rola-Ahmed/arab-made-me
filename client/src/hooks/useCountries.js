import { useAppTranslation } from "config.js";

const useCountries = () => {
  const { trans: t } = useAppTranslation();

  const countriesMiddleEast = [
    {
      id: "eg",
      code: t("countries:egypt.name"),
      name: t("countries:egypt.name"),
      phoneCode: "+20",
      mobileLength: "10",
      coordinates: [30, 30],
    },
    {
      id: "bh",
      code: t("countries:bahrain.name"),
      name: t("countries:bahrain.name"),
      phoneCode: "+973",
      mobileLength: "8",
      coordinates: [52, 26],
    },

    {
      id: "iq",
      code: t("countries:iraq.name"),
      name: t("countries:iraq.name"),
      phoneCode: "+964",
      mobileLength: "",
      coordinates: [43, 33],
    },
    {
      id: "sa",
      code: t("countries:saudiArabia.name"),
      name: t("countries:saudiArabia.name"),
      phoneCode: "+966",
      mobileLength: "9",
      coordinates: [45, 25.079162],
    },
    {
      id: "ye",
      code: t("countries:yemen.name"),
      name: t("countries:yemen.name"),
      phoneCode: "+967",
      mobileLength: "9",
      coordinates: [45, 15],
    },
    {
      id: "sy",
      code: t("countries:syria.name"),
      name: t("countries:syria.name"),
      phoneCode: "+963",
      mobileLength: "9",
      coordinates: [39, 35],
    },
    {
      id: "jo",
      code: t("countries:jordan.name"),
      name: t("countries:jordan.name"),
      phoneCode: "+962",
      mobileLength: "9",
      coordinates: [36, 30],
    },
    {
      id: "ae",
      code: t("countries:unitedArabEmirates.name"),
      name: t("countries:unitedArabEmirates.name"),
      phoneCode: "+971",
      mobileLength: "9",
      coordinates: [54, 24],
    },
    {
      id: "lb",
      code: t("countries:lebanon.name"),
      name: t("countries:lebanon.name"),
      phoneCode: "+961",
      mobileLength: "7",
      coordinates: [35, 33],
    },
    {
      id: "om",
      code: t("countries:oman.name"),
      name: t("countries:oman.name"),
      phoneCode: "+968",
      mobileLength: "8",
      coordinates: [57, 20],
    },
    {
      id: "kw",
      code: t("countries:kuwait.name"),
      name: t("countries:kuwait.name"),
      phoneCode: "+965",
      mobileLength: "8",
      coordinates: [48, 29],
    },
    {
      id: "qa",
      code: t("countries:qatar.name"),
      name: t("countries:qatar.name"),
      phoneCode: "+974",
      mobileLength: "8",
      coordinates: [51.5, 25],
    },
    {
      id: "ps",
      code: t("countries:palestine.name"),
      name: t("countries:palestine.name"),
      phoneCode: "+970",
      mobileLength: "",
      coordinates: [35, 32],
    },
  ];

  return countriesMiddleEast;
};

export default useCountries;
