import { useAppTranslation } from "config.js";

const useCountries = () => {
  const { trans: t } = useAppTranslation();


  // code is usded for functionalitiy
  // while name is used for the user trnasation
  const countriesMiddleEast = [
    {
      id: "eg",
      code: 'Egypt',
      name: t("countries:egypt.name"),
      phoneCode: "+20",
      mobileLength: "10",
      coordinates: [30, 30],
    },
    {
      id: "bh",
      code:"Bahrain",
      name: t("countries:bahrain.name"),
      phoneCode: "+973",
      mobileLength: "8",
      coordinates: [52, 26],
    },

    {
      id: "iq",
      code: "Iraq",
      name: t("countries:iraq.name"),
      phoneCode: "+964",
      mobileLength: "",
      coordinates: [43, 33],
    },
    {
      id: "sa",
      code: "Saudi Arabia",
      name: t("countries:saudiArabia.name"),
      phoneCode: "+966",
      mobileLength: "9",
      coordinates: [45, 25.079162],
    },
    {
      id: "ye",
      code: "Yemen",
      name: t("countries:yemen.name"),
      phoneCode: "+967",
      mobileLength: "9",
      coordinates: [45, 15],
    },
    {
      id: "sy",
      code: "Syria",
      name: t("countries:syria.name"),
      phoneCode: "+963",
      mobileLength: "9",
      coordinates: [39, 35],
    },
    {
      id: "jo",
      code: "Jordan",
      name: t("countries:jordan.name"),
      phoneCode: "+962",
      mobileLength: "9",
      coordinates: [36, 30],
    },
    {
      id: "ae",
      code:"United Arab Emirates",
      name: t("countries:unitedArabEmirates.name"),
      phoneCode: "+971",
      mobileLength: "9",
      coordinates: [54, 24],
    },
    {
      id: "lb",
      code: "Lebanon",
      name: t("countries:lebanon.name"),
      phoneCode: "+961",
      mobileLength: "7",
      coordinates: [35, 33],
    },
    {
      id: "om",
      code:"Oman",
      name: t("countries:oman.name"),
      phoneCode: "+968",
      mobileLength: "8",
      coordinates: [57, 20],
    },
    {
      id: "kw",
      code:"Kuwait",
      name: t("countries:kuwait.name"),
      phoneCode: "+965",
      mobileLength: "8",
      coordinates: [48, 29],
    },
    {
      id: "qa",
      code:  "Qatar",
      name: t("countries:qatar.name"),
      phoneCode: "+974",
      mobileLength: "8",
      coordinates: [51.5, 25],
    },
    {
      id: "ps",
      code: "Palestine",
      name: t("countries:palestine.name"),
      phoneCode: "+970",
      mobileLength: "",
      coordinates: [35, 32],
    },
  ];

  return countriesMiddleEast;
};

export default useCountries;
