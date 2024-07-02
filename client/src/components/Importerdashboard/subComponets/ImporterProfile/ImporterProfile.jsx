import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { pdfIcon } from "constants/Images";

import Carousel from "react-grid-carousel";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";

import { countriesMiddleEast } from "constants/countries";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";

export default function ImporterProfile() {
  document.title = "Importer Profile";

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [activeMenu] = useOutletContext();

  const [ImporterProfile, setImporterProfile] = useState([]);
  const [renderDataUpdate, setRenderDataUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allSectors, setAllSectors] = useState([]);
  const [errorMsg, setErrorMsg] = useState();

  // slider setting
  const [allowEmailNotification, setAllowEmailNotification] = useState();
  const [selectedDocs, setSelectedDocs] = useState([]);
  // api
  async function fetchFactoryPage() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setImporterProfile(response.data.importers);
      } else if (response.data.message == "404 Not Found") {
        // errorMsg("404");
      }
    } catch (error) {}
  }

  // Cover IMage Profile -----------------------------------------------------

  function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    const config = {
      method: "put",
      url: `${baseUrl}/importers/media`,
      headers: {
        Authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          ModalClose();
          toast("Image Saved Successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            //pauseOnHover: true,
            draggable: true,
            theme: "colored",
            type: "success",
          });
          setRenderDataUpdate(!renderDataUpdate);
          //
          setSelectedDocs([]);
          setIsLoading(false);
        } else {
          setIsLoading(false);

          toast("Image Not Saved, please try again", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            // progress: undefined,
            theme: "colored",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);

        toast("Image Not Saved, please try again", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "error",
        });
        // console.error("IMG error", error);
      });
  }

  useEffect(() => {
    if (currentUserData && currentUserData?.importerId) {
      fetchFactoryPage();
    }
  }, [currentUserData?.importerId, renderDataUpdate]);

  // update data
  let emailValidation = Yup.string()
    .email("Invalid email")
    .required("Input Field is Required")
    .min(5, "min length is 5")
    .max(255, "max length is 255");

  let nameValidation = Yup.string()
    .required("Input Field is Required")
    .min(3, "min length is 3")
    .max(25, "max length is 25");
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    // .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  const [show, setShow] = useState({
    accountInfoReadOnly: false,
    passwordChangeReadOnly: false,
    factoryInfoChangeReadOnly: false,
    socialAccountsReadOnly: false,
    profilePicReadOnly: false,
    legalDocsReadOnly: false,
  });
  function ModalClose() {
    setShow((prevVal) => {
      const newState = { ...prevVal }; // Create a copy of the previous state

      // Iterate through the keys in the state
      Object.keys(newState).forEach((key) => {
        newState[key] = false; // Set each property to false
      });

      return newState; // Return the updated state
    });
  }

  let [toggleSeePassword, settoggleSeePassword] = useState({
    confirmPassword: false,
    password: false,
    oldPassword: false,
  });

  let AccountInfoValidation = useFormik({
    initialValues: {
      repFullName: ImporterProfile?.repName || "",
      repEmail: ImporterProfile?.repEmail || "",
      repPhone: ImporterProfile?.repPhone || "",
      name: ImporterProfile?.name || "",
    },

    validationSchema: Yup.object().shape({
      repFullName: nameValidation,
      name: nameValidation,
      repEmail: emailValidation,
      repPhone: phoneValidation,
    }),
    onSubmit: submitForm,
  });

  // social links
  let SocialAccountValidation = useFormik({
    initialValues: {
      instgramLink: "",
      facebookLink: "",
      website: "",
    },
    validationSchema: Yup.object().shape({
      website: Yup.string().url("Invalid URL format"),
      instgramLink: Yup.string().url("Invalid URL format"),
      facebookLink: Yup.string().url("Invalid URL format"),
    }),
    onSubmit: submitForm,
  });

  // IMporterInfoValidation
  let ImporterInfoValidation = useFormik({
    initialValues: {
      city: "",
      country: "",
      commercialRegisterationNumber: "",
      sectorId: "",
      address: "",
      description: "",
      exportingCountries: "",
    },
    validationSchema: Yup.object().shape({
      city: Yup.string().min(3, "min length is 3").max(60, "max length is 60"),

      commercialRegisterationNumber: Yup.string()
        // .required("Input Field is Required")
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(8, "min length is 8")
        .max(16, "max length is 16"),

      address: Yup.string()
        .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),

      description: Yup.string()
        .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),
      exportingCountries: Yup.array().of(Yup.string()).nullable(),
    }),
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {};
    // cotinue
    if (show?.accountInfoReadOnly) {
      data = {
        repName: values.repFullName,

        // repEmail: values.repEmail,

        repPhone: values.repPhone,
        // name: values.name,
      };

      // if (values.name !== ImporterProfile.name) {
      data.name = values.name;
      // }
      if (values.repEmail !== ImporterProfile.repEmail) {
        data.repEmail = values.repEmail;
      }
    }
    if (show?.factoryInfoChangeReadOnly) {
      data = {
        country: values.country,
        // commercialRegisterationNumber: values.commercialRegisterationNumber,
        address: [values.address],
        description: values.description,
      };

      if (values.commercialRegisterationNumber !== "") {
        data.commercialRegisterationNumber =
          values.commercialRegisterationNumber;
      }

      if (values.city !== "") {
        data.city = values.city;
      }
      if (values.exportingCountries.length !== 0) {
        data.exportingCountries = values.exportingCountries;
      }

      if (values.sectorId !== "") {
        data.sectorId = values.sectorId;
      }
    }

    if (show?.socialAccountsReadOnly) {
      data = {
        socialLinks: {
          // facebook: values.facebookLink,
          // instagram: values.instgramLink,
        },
        website: values.website,
      };

      if (values.website !== "") {
        data.website = values.website;
      }

      if (values.facebookLink != "") {
        data.socialLinks["facebook"] = values.facebookLink;
      }
      if (values.instgramLink != "") {
        data.socialLinks["instagram"] = values.instgramLink;
      }
    }

    try {
      setIsLoading(true);
      let config = {
        method: "put",
        url: `${baseUrl}/importers/update/fromUser`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);
      setIsLoading(false);
      if (response.data.message == "done") {
        ModalClose();
        toast("Data added Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          //pauseOnHover: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "success",
        });

        setRenderDataUpdate(!renderDataUpdate);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));

            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));

            break;

          case 500:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            window.scrollTo({ top: 1642.4000244140625 });

            break;
          default:
            window.scrollTo({ top: 1642.4000244140625 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }
    }
    setIsLoading(false);
  }

  // Password Validation
  let formPasswordValidation = useFormik({
    initialValues: {
      //-------------------- change password
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object().shape({
      oldPassword: Yup.string()
        .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),

      password: Yup.string()
        .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),
      confirmPassword: Yup.string()
        .required("Input Field is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    // validateOnChange: true, // Trigger validation on change
    // validateOnMount: true,
    onSubmit: submitPasswordForm,
  });

  async function submitPasswordForm(values) {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {};
    // cotinue
    data = {
      oldPassword: values.oldPassword,

      password: values.password,
    };

    try {
      let config = {
        method: "put",
        url: `${baseUrl}/users/update/fromUser`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        ModalClose();

        toast("Data added Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          //pauseOnHover: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "success",
        });

        setRenderDataUpdate(!renderDataUpdate);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));

            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));

            break;

          case 500:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            window.scrollTo({ top: 1642.4000244140625 });

            break;
          default:
            window.scrollTo({ top: 1642.4000244140625 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }
    }
  }

  useEffect(() => {
    if (ImporterProfile && ImporterProfile.length !== 0) {
      AccountInfoValidation.setValues({
        repFullName: ImporterProfile?.repName || "",
        repEmail: ImporterProfile?.repEmail || "",
        repPhone: ImporterProfile?.repPhone || "",
        name: ImporterProfile?.name || "",
      });

      SocialAccountValidation.setValues({
        instgramLink: ImporterProfile?.socialLinks?.instgram || "",
        facebookLink: ImporterProfile?.socialLinks?.facebook || "",
        website: ImporterProfile?.website || "",
      });

      ImporterInfoValidation.setValues({
        city: ImporterProfile?.city || "",
        country: ImporterProfile?.country || "",

        commercialRegisterationNumber:
          ImporterProfile?.commercialRegisterationNumber || "",

        address: ImporterProfile?.address?.[0] || "",

        description: ImporterProfile?.description || "",
        exportingCountries: ImporterProfile?.exportingCountries,
        sectorId: ImporterProfile?.[0]?.id || "",
      });
    }
    setAllowEmailNotification(ImporterProfile?.allowEmailNotification);
  }, [ImporterProfile]);

  function initializeFormValues() {
    let accInfo = {
      repFullName: ImporterProfile?.repName || "",
      repEmail: ImporterProfile?.repEmail || "",
      repPhone: ImporterProfile?.repPhone || "",
      name: ImporterProfile?.name || "",
    };

    let socialAcc = {
      instgramLink: ImporterProfile?.socialLinks?.instgram || "",
      facebookLink: ImporterProfile?.socialLinks?.facebook || "",
      website: ImporterProfile?.website || "",
    };
    let ImporterInfo = {
      city: ImporterProfile?.city || "",
      country: ImporterProfile?.country || "",

      commercialRegisterationNumber:
        ImporterProfile?.commercialRegisterationNumber || "",

      address: ImporterProfile?.address?.[0] || "",

      description: ImporterProfile?.description || "",
      exportingCountries: ImporterProfile?.exportingCountries,
      sectorId: ImporterProfile?.[0]?.id || "",
    };

    return ImporterInfo, socialAcc, accInfo;
    // resetFormVal(ImporterInfo,socialAcc,accInfo)
  }
  function resetFormVal() {
    const { ImporterInfo, socialAcc, accInfo } = initializeFormValues();

    SocialAccountValidation.resetForm({
      values: socialAcc, // Optional: Reset values to an empty object
      errors: {}, // Optional: Reset errors to an empty object
      touched: {}, // Optional: Reset touched to an empty object
      status: undefined, // Optional: Reset status to undefined
      isSubmitting: false, // Optional: Reset isSubmitting to false
      isValidating: false, // Optional: Reset isValidating to false
      submitCount: 0, // Optional: Reset submitCount to 0
    });

    AccountInfoValidation.resetForm({
      values: accInfo,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    ImporterInfoValidation.resetForm({
      values: ImporterInfo,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    // -------------------------------------------------------

    // SocialAccountValidation.resetForm({
    //   values: {
    //     instgramLink: ImporterProfile?.socialLinks?.instgram || "",
    //     facebookLink: ImporterProfile?.socialLinks?.facebook || "",
    //     website: ImporterProfile?.website || "",
    //   }, // Optional: Reset values to an empty object
    //   errors: {}, // Optional: Reset errors to an empty object
    //   touched: {}, // Optional: Reset touched to an empty object
    //   status: undefined, // Optional: Reset status to undefined
    //   isSubmitting: false, // Optional: Reset isSubmitting to false
    //   isValidating: false, // Optional: Reset isValidating to false
    //   submitCount: 0, // Optional: Reset submitCount to 0
    // });

    // AccountInfoValidation.resetForm({
    //   values: {
    //     repFullName: ImporterProfile?.repName || "",
    //     repEmail: ImporterProfile?.repEmail || "",
    //     repPhone: ImporterProfile?.repPhone || "",
    //     name: ImporterProfile?.name || "",
    //   },
    //   errors: {},
    //   touched: {},
    //   status: undefined,
    //   isSubmitting: false,
    //   isValidating: false,
    //   submitCount: 0,
    // });

    // ImporterInfoValidation.resetForm({
    //   values: {
    //     city: ImporterProfile?.city || "",
    //     country: ImporterProfile?.country || "",
    //     commercialRegisterationNumber:
    //       ImporterProfile?.commercialRegisterationNumber || "",
    //     address: ImporterProfile?.address?.[0] || "",
    //     description: ImporterProfile?.description || "",
    //     exportingCountries: ImporterProfile?.exportingCountries || [],
    //     sectorId: ImporterProfile?.[0]?.id || "",
    //   },
    //   errors: {},
    //   touched: {},
    //   status: undefined,
    //   isSubmitting: false,
    //   isValidating: false,
    //   submitCount: 0,
    // });

    setSelectedDocs([]);
  }
  function handleClose(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: false,
    }));

    // reset message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // Reset the form and clear validation errors
    //  SocialAccountValidation.resetForm();
    //  OR

    resetFormVal();
    // initializeFormValues()
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    try {
      let config = {
        method: "put",
        url: `${baseUrl}/importers/update/fromUser`,
        headers: {
          authorization: isLogin,
        },
        data: {
          allowEmailNotification: !allowEmailNotification,
        },
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        toast("Allow Email Notifications updated Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          //pauseOnHover: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "success",
        });

        setRenderDataUpdate(!renderDataUpdate);
      } else {
        toast(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          //pauseOnHover: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "error",
        });
      }
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));

            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));

            break;

          case 500:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            window.scrollTo({ top: 1642.4000244140625 });

            break;
          default:
            window.scrollTo({ top: 1642.4000244140625 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }

      // window.scrollTo({ top: 1642.4000244140625 });
    }
  };

  function handleMultiMediaValidation(e, keyWordDoc, inputValue) {
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === keyWordDoc
    )?.length;

    if (count == 1 && keyWordDoc == "coverImage") {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 1`,
      }));
      return;
    }

    if (count >= 3) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 3`,
      }));
      return;
    }
    // clear error message
    setErrorMsg((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[keyWordDoc];
      return newErrors;
    });
    let acceptedExtensions = [];

    if (keyWordDoc == "legalDocs") {
      acceptedExtensions = ["pdf", "png", "jpeg", "jpg"];
    } else if (keyWordDoc == "image") {
      acceptedExtensions = ["png", "jpeg", "jpg"];
    }
    const fileType = e.type;

    const isAcceptedType = acceptedExtensions?.some((extension) =>
      fileType?.toLowerCase()?.includes(extension?.toLowerCase())
    );

    if (!isAcceptedType) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]:
          // "Invalid file format. Only pdf, png, jpeg, jpg, mp4 allowed"
          `Invalid file format. Only ${acceptedExtensions.join(
            ", "
          )} are allowed`,
      }));
      return;
    }

    const mediaNameExists = selectedDocs?.some(
      (item) => item?.pdfFile?.name === e?.name && item?.keyWord === keyWordDoc
    );

    // if image aleady exisit
    if (mediaNameExists) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Media already exists",
      }));
      return;
    } else {
    }

    let updatedDocs = [...selectedDocs];

    // Image loaded successfully
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedDocs.push({
        keyWord: keyWordDoc,
        pdfFile: e,
        imageReaderURL: reader.result,
        onprogress: 100,
      });

      setSelectedDocs(updatedDocs);
      const coverImgInput = document?.getElementById(inputValue);
      if (coverImgInput) {
        coverImgInput.value = "";
      }
    };

    reader.onprogress = (event) => {
      // Calculate and show the loading percentage
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;

        // if (updatedDocs.length > 0) {
        //   // Adding a new attribute to the last object
        //   // updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   // setSelectedDocs([...updatedDocs]);

        //   // setSelectedDocs((prevDocs) => {
        //   //   const updatedDocs = [...prevDocs];
        //   //   if (updatedDocs.length > 0) {
        //   //     updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   //   }
        //   //   return updatedDocs;
        //   // });
        // }
        // setimgloadin(percentage);
      }
    };

    reader.onerror = () => {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Error loading image",
      }));
    };

    reader.readAsDataURL(e);
  }

  function removeSelectedDoc(docId, keyWordDoc) {
    // when removing
    setSelectedDocs((prevValue) =>
      prevValue.filter(
        (doc) => !(doc.pdfFile?.name === docId && doc.keyWord === keyWordDoc)
      )
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/sectors?size=10`);

        if (response.data.message === "done") {
          setAllSectors(response.data.sectors);
        }
      } catch (error) {}
    };

    fetchData(); // Call the asynchronous function
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the '#' character to get the ID
      const targetId = hash.substring(1);

      // Get the target element by ID
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [activeMenu]);
  return (
    <>
      <ToastContainer />
      <div
        className="section factory-profile
      me-5 ms-5 mb-5 mt-2 "
      >
        <PageUtility currentPage="Importer Profile " />

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* profile Image container 1 */}
              <div id="profileImage"></div>
              <div
                // name="profileImage"
                className="container-profile-input w-100 "
              >
                <div className="title-contianer-input w-100">
                  <p>Profile Image</p>
                  <div className="w-100 ">
                    <form
                      onSubmit={(e) => updateMedia(e, "image")}
                      encType="multipart/form-data"
                    >
                      <div className="row  row-gap">
                        <div className="col-12">
                          <div className="grid-gap-col position-relative">
                            <div className="factory-logo  edit-img ">
                              <img
                                className="w-100 h-100 "
                                src={`${baseUrl_IMG}/${ImporterProfile?.image}`}
                                alt="buyer profile image"
                                onError={handleImageError}
                              />
                            </div>
                            <small className="form-text text-danger">
                              {errorMsg?.image}
                            </small>
                            <div className="edit-icon-profile-btn position-absolute  cursor">
                              <i
                                onClick={() => handleShow("profilePicReadOnly")}
                                className=" imgupload fa-solid fa-pen-to-square  cursor"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="accountInformation"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Account Inforamtions</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Business Account</label>
                            <input
                              className="form-control"
                              value={currentUserData?.userEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>representive Full Name</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.repName || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Importer Name</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representive Email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={ImporterProfile?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representive Phone Number</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("accountInfoReadOnly")}
                        >
                          <p className="cursor">Change Account Information </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="PasswordChange"></div>
              {/*Password change container 2 */}
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Password Change</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-12">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Change Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Enter New Password"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>Confirm Password</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Confirm Password"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("passwordChangeReadOnly")}
                        >
                          <p className="cursor">Change Password </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*Social Accounts container 2 */}
              <div id="socialAccount"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Social Accounts</p>
                  <div className="w-100 ">
                    {/* <form> */}
                    <div className="row grid-gap-col">
                      <div className="col-12  ">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer facebook"
                            title="attach facebook link to the website"
                          >
                            <i className="fab fa-facebook-f fa-2x"></i>
                          </div>

                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer instagram"
                            title="attach instagram link to the websitek"
                          >
                            <i className="fab fa-instagram fa-2x"></i>
                          </div>
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer "
                            title="attach website link to the websitek"
                          >
                            <i className="fa-solid fa-link fa-2x"></i>
                          </div>
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </div>

              {/*Links container 2 */}
              <div id="EmailNotification"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Notifications</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div className="form-group m-0 p-0">
                            <label>Allow Email Notifications</label>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input switch-input cursor"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              // checked={allowEmailNotification!==null ? allowEmailNotification : ImporterProfile?.allowEmailNotification }
                              // checked={ImporterProfile?.allowEmailNotification }
                              checked={allowEmailNotification}
                              onClick={EmailNotificationUpdate2}
                              onChange={() =>
                                setAllowEmailNotification((prev) => !prev)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ----------------------- */}
                  </div>
                </div>
              </div>

              {/* Lecal certifcates   */}
              {/*Links container 2 */}
              <div id="legalDocs"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Legal Documents</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        {ImporterProfile?.legalDocs ? (
                          <Carousel
                            cols={2}
                            rows={1}
                            gap={10}
                            scrollSnap={true}
                            loop
                            showDots
                            // arrowLeft={
                            //   <div
                            //     className="arrow-btn   "
                            //   >
                            //     <i className="fa-solid fa-chevron-left"></i>
                            //   </div>
                            // }
                            // arrowRight={
                            //   <div
                            //     className="arrow-btn  bg-danger"
                            //   >
                            //     <i className="fa-solid fa-chevron-right"></i>
                            //   </div>
                            // }
                            hideArrow={false}
                            // className={`d-grid`}
                            // style={{ width: "88vw" }}
                          >
                            {ImporterProfile?.legalDocs?.length !== 0
                              ? ImporterProfile?.legalDocs?.map((item) => (
                                  <Carousel.Item>
                                    <div className="dots-slider-img w-100">
                                      <img
                                        className="h-100 w-100 "
                                        // onClick={() => next(index)}
                                        id={handleImageError}
                                        src={`${baseUrl_IMG}/${item}`}
                                        // src={`http://3.28.122.72/${item}`}
                                        alt="Img"
                                        onError={handleImageError}
                                      />
                                    </div>
                                  </Carousel.Item>
                                ))
                              : ""}
                          </Carousel>
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("legalDocsReadOnly")}
                        >
                          <p className="cursor">Upload </p>
                        </Button>
                      </div>
                    </div>
                    {/* </form> */}
                    {/* ----------------------- */}
                  </div>
                </div>
              </div>

              {/*  FACTORY iNFO*/}
              <div id="importerInforamtion"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Importer Inforamtion</p>
                  <div className="w-100 ">
                    <form>
                      <div className="row  row-gap">
                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Factory Name</label>
                              <input
                                className="form-control"
                                value={ImporterProfile?.name || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Sector</label>
                              <input
                                className="form-control"
                                value={
                                  allSectors.some(
                                    (item) =>
                                      item.id === ImporterProfile?.sectorId
                                  )
                                    ? allSectors.find(
                                        (item) =>
                                          item.id === ImporterProfile?.sectorId
                                      ).name
                                    : ""
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Country</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.country || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.city || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>Yearly Sales Income</label>
                            <input
                              className="form-control"
                              value={
                                ImporterProfile?.yearlySalesIncome ||
                                "USD 1M-5M"
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>commercial Registeration Number</label>
                            <input
                              className="form-control"
                              value={
                                ImporterProfile?.commercialRegisterationNumber ||
                                ""
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>Importer Location</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.address?.[0] || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>exporting Countries</label>
                            <input
                              className="form-control"
                              value={
                                ImporterProfile?.exportingCountries?.length !==
                                0
                                  ? (
                                      ImporterProfile?.exportingCountries?.map(
                                        (item) =>
                                          Array.isArray(item)
                                            ? item.join(", ")
                                            : item
                                      ) || []
                                    ).join(", ")
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label>Importer description</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={ImporterProfile?.description || ""}
                              readOnly
                            ></textarea>
                          </div>
                        </div>

                        <div className="col-12">
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() =>
                              handleShow("factoryInfoChangeReadOnly")
                            }
                          >
                            <p className="cursor">
                              Change Importer Information
                            </p>
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account setting Info Chnage  update form*/}
      <Modal
        show={show.accountInfoReadOnly}
        onHide={() => handleClose("accountInfoReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div closeButton className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              {/* <p>Account Inforamtions</p> */}
              <Modal.Header closeButton>
                <Modal.Title>Account Inforamtions</Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <form onSubmit={AccountInfoValidation.handleSubmit}>
                <div className="w-100 ">
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>representive full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repFullName"
                            name="repFullName"
                            placeholder="Enter full Name"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repFullName}
                          />
                          {AccountInfoValidation.errors.repFullName &&
                          AccountInfoValidation.touched.repFullName ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repFullName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Importer Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter full Name"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.name}
                          />
                          {AccountInfoValidation.errors.name &&
                          AccountInfoValidation.touched.name ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.name}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label> Representive Email</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repEmail"
                            name="repEmail"
                            placeholder="enter Representive Email"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repEmail}
                          />

                          {AccountInfoValidation.errors.repEmail &&
                          AccountInfoValidation.touched.repEmail ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repEmail}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Representive Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repPhone"
                            name="repPhone"
                            placeholder="01113622484"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repPhone}
                          />

                          {AccountInfoValidation.errors.repPhone &&
                          AccountInfoValidation.touched.repPhone ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repPhone}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("accountInfoReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Password Change modal  update form*/}
      <form onSubmit={formPasswordValidation.handleSubmit}>
        <Modal
          show={show.passwordChangeReadOnly}
          onHide={() => handleClose("passwordChangeReadOnly")}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="factory-profile"
        >
          <Modal.Body closeButton>
            <div className="container-profile-input w-100">
              <div className="title-contianer-input w-100">
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p>Password Change</p>
                  </Modal.Title>
                </Modal.Header>
                {errorMsg?.response ? (
                  <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                    {errorMsg?.response}
                  </div>
                ) : (
                  ""
                )}
                <div className="w-100 ">
                  {/* <form> */}
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Old Password</label>

                          <div class="input-group">
                            <input
                              type={`${
                                toggleSeePassword.oldPassword == true
                                  ? "text"
                                  : "password"
                              }`}
                              autoComplete="new-password"
                              className="form-control"
                              id="oldPassword"
                              name="oldPassword"
                              onChange={formPasswordValidation.handleChange}
                              onBlur={formPasswordValidation.handleBlur}
                              value={formPasswordValidation.values.oldPassword}
                              // didnt allow pating
                              // onPaste={(e) => e.preventDefault()}

                              // placeholder="Change Password"
                            />
                            <div
                              class="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  oldPassword: !toggleSeePassword.oldPassword,
                                }))
                              }
                            >
                              <span
                                class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                  toggleSeePassword.oldPassword == true
                                    ? "fa-solid fa-eye-slash"
                                    : "fa-solid fa-eye"
                                }`}
                              ></span>
                            </div>
                          </div>

                          {formPasswordValidation.errors.oldPassword &&
                          formPasswordValidation.touched.oldPassword ? (
                            <small className="text-danger">
                              {formPasswordValidation.errors.oldPassword}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Change Password</label>

                          <div class="input-group">
                            <input
                              type={`${
                                toggleSeePassword.password == true
                                  ? "text"
                                  : "password"
                              }`}
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Change Password"
                              onChange={formPasswordValidation.handleChange}
                              onBlur={formPasswordValidation.handleBlur}
                              value={formPasswordValidation.values.password}
                              autoComplete="new-passowrd"
                            />
                            <div
                              class="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  password: !toggleSeePassword.password,
                                }))
                              }
                            >
                              <span
                                class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                  toggleSeePassword.password == true
                                    ? "fa-solid fa-eye-slash"
                                    : "fa-solid fa-eye"
                                }`}
                              ></span>
                            </div>
                          </div>

                          {formPasswordValidation.errors.password &&
                          formPasswordValidation.touched.password ? (
                            <small className="text-danger">
                              {formPasswordValidation.errors.password}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>Confirm Password</label>

                        <div class="input-group">
                          <input
                            type={`${
                              toggleSeePassword.confirmPassword == true
                                ? "text"
                                : "password"
                            }`}
                            className="form-control"
                            onPaste={(event) => {
                              // paste is not allowed
                              event.preventDefault();
                              event.clipboardData.getData("text/plain");
                            }}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={formPasswordValidation.handleChange}
                            onBlur={formPasswordValidation.handleBlur}
                            value={
                              formPasswordValidation.values.confirmPassword
                            }
                          />
                          <div
                            class="input-group-append h-100 cursor"
                            onClick={() =>
                              settoggleSeePassword((prevData) => ({
                                ...prevData,
                                confirmPassword:
                                  !toggleSeePassword.confirmPassword,
                              }))
                            }
                          >
                            <span
                              class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                toggleSeePassword.confirmPassword == true
                                  ? "fa-solid fa-eye-slash"
                                  : "fa-solid fa-eye"
                              }`}
                            ></span>
                          </div>
                        </div>

                        {formPasswordValidation.errors.confirmPassword &&
                        formPasswordValidation.touched.confirmPassword ? (
                          <small className="text-danger">
                            {formPasswordValidation.errors.confirmPassword}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("passwordChangeReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* </form> */}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </form>

      {/* -------------------------------------------------------------------------------------------------- */}
      {/* Factory Info Modal update form */}
      {/* <form onSubmit={ImporterInfoValidation.handleSubmit}> */}
      <Modal
        show={show.factoryInfoChangeReadOnly}
        onHide={() => handleClose("factoryInfoChangeReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Importer Inforamtion</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form onSubmit={ImporterInfoValidation.handleSubmit}>
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="form-group">
                        <label>sector</label>
                        <select
                          className="form-select form-control"
                          onChange={
                            // setCountryVal(event.target.value);
                            ImporterInfoValidation.handleChange
                          }
                          id="sectorId"
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.sectorId}
                        >
                          <option value="">Select sector</option>
                          {allSectors.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          className="form-select form-control"
                          onChange={(event) => {
                            // setCountryVal(event.target.value);
                            ImporterInfoValidation.handleChange(
                              event.target.value
                            );
                          }}
                          id="country"
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.country}
                        >
                          {countriesMiddleEast.map((countryItem) => (
                            <option value={countryItem.code}>
                              {countryItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          // type="text"
                          placeholder="Enter City"
                          className="form-control"
                          id="city"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.city}
                        />
                        {ImporterInfoValidation.errors.city &&
                        ImporterInfoValidation.touched.city ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.city}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>commercial Registeration Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="commercialRegisterationNumber"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={
                            ImporterInfoValidation.values
                              .commercialRegisterationNumber
                          }
                        />
                        {ImporterInfoValidation.errors
                          .commercialRegisterationNumber &&
                        ImporterInfoValidation.touched
                          .commercialRegisterationNumber ? (
                          <small className="text-danger">
                            {
                              ImporterInfoValidation.errors
                                .commercialRegisterationNumber
                            }
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label> Location</label>
                        <input
                          className="form-control"
                          id="address"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.address}
                        />
                        {ImporterInfoValidation.errors.address &&
                        ImporterInfoValidation.touched.address ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.address}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label forhtml="exportingCountries">
                          exporting Countries
                        </label>

                        {/*  */}
                        <button
                          className="btn d-flex justify-content-between  dropdown-toggle w-100 text-start select-countries"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Select Countries
                          {/* {Dropdown} */}
                        </button>
                        <ul className="dropdown-menu col-5 scroller">
                          {countriesMiddleEast.map((item) => (
                            <li>
                              <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                                <input
                                  onChange={ImporterInfoValidation.handleChange}
                                  className="form-check-input cursor me-3 "
                                  type="checkbox"
                                  name="exportingCountries"
                                  id="exportingCountries"
                                  value={item.code}
                                  defaultChecked={ImporterProfile?.exportingCountries?.some(
                                    (type) =>
                                      item.code
                                        .toLowerCase()
                                        .includes(type.toLowerCase())
                                  )}
                                />
                                <label
                                  className="form-check-label p-0 m-0"
                                  htmlFor="exportingCountries"
                                >
                                  {item.name}
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/*  */}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label> description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          id="description"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.description}
                        ></textarea>
                        {ImporterInfoValidation.errors.description &&
                        ImporterInfoValidation.touched.description ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.description}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("factoryInfoChangeReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* </form> */}

      {/* Social Links update form */}
      <Modal
        show={show.socialAccountsReadOnly}
        onHide={() => handleClose("socialAccountsReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Importer Inforamtion</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form onSubmit={SocialAccountValidation.handleSubmit}>
                  <div className="row  row-gap">
                    <div className="row grid-gap-col">
                      <div className="col-12  ">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer facebook"
                            title="attach facebook link to the website"
                          >
                            <i className="fab fa-facebook-f fa-2x"></i>
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="facebookLink"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={
                                SocialAccountValidation.values.facebookLink
                              }
                            />
                            {SocialAccountValidation.errors.facebookLink &&
                            SocialAccountValidation.touched.facebookLink ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.facebookLink}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer instagram"
                            title="attach instagram link to the websitek"
                          >
                            <i className="fab fa-instagram fa-2x"></i>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="instgramLink"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={
                                SocialAccountValidation.values.instgramLink
                              }
                            />
                            {SocialAccountValidation.errors.instgramLink &&
                            SocialAccountValidation.touched.instgramLink ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.instgramLink}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer "
                            title="attach website link to the websitek"
                          >
                            <i className="fa-solid fa-link fa-2x"></i>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="website"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={SocialAccountValidation.values.website}
                            />
                            {SocialAccountValidation.errors.website &&
                            SocialAccountValidation.touched.website ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.website}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("socialAccountsReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  legal docs */}

      <Modal
        show={show.legalDocsReadOnly}
        onHide={() => handleClose("legalDocsReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Legal Documents</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <form
                onSubmit={(e) => updateMedia(e)}
                encType="multipart/form-data"
              >
                <div className="w-100 ">
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          {/*  */}

                          {/*  */}

                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="legalDocsInput"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "legalDocs"
                                );
                              }

                              e.target.classList.remove("highlight");
                            }}
                            onDragOver={(e) => {
                              e.target.classList.add("highlight");

                              e.preventDefault();
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.target.classList.remove("highlight");
                            }}
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files?.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "legalDocs",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="legalDocsInput"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only pdf, png, jpeg, and jpg are allowed. A maximum
                            of 3 pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.legalDocs}
                          </small>

                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "legalDocs" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                    {/* <div> */}

                                    <div className="d-flex justify-content-start align-items-center ">
                                      <img
                                        // src={item.imageReaderURL}
                                        src={
                                          item?.pdfFile?.name?.includes("pdf")
                                            ? pdfIcon
                                            : item.imageReaderURL
                                        }
                                        className="image-upload-file me-3"
                                      />
                                    </div>

                                    <div className="w-100">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <p className="img-name text-tarute">
                                            {item?.pdfFile?.name}
                                          </p>
                                          <p className="img-name">
                                            {(
                                              item?.pdfFile?.size / 1024
                                            )?.toFixed(2)}
                                            KB
                                          </p>
                                          {/* {imgloadin} */}
                                        </div>

                                        <div
                                          onClick={() =>
                                            removeSelectedDoc(
                                              item?.pdfFile?.name,
                                              "legalDocs",
                                              index
                                            )
                                          }
                                          className="cursor"
                                        >
                                          <i className="fa-solid fa-trash-can"></i>
                                        </div>
                                      </div>

                                      <div className="d-flex  align-items-center">
                                        <progress
                                          className="w-100"
                                          id="progressBar"
                                          max="100"
                                          value={item?.onprogress || 0}
                                          // value="30"
                                          imgloadin
                                        ></progress>
                                        {item?.onprogress}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            // </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="update-img-container row">
                        {selectedDocs.map((item, index) => (
                          <div className="col-12">
                            <div className="d-flex justify-content-start align-items-start ">
                              <img
                                src={item.imageReaderURL}
                                className="img-update"
                                alt={` legal documents ${index}`}
                              />
                              <div
                                onClick={() =>
                                  removeSelectedDoc(
                                    item?.pdfFile?.name,
                                    "legalDocs"
                                  )
                                }
                                className="cursor"
                              >
                                <i class="fa-solid fa-xmark"></i>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("legalDocsReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit for review</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* </form> */}

      <Modal
        show={show.profilePicReadOnly}
        onHide={() => handleClose("profilePicReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Profile Picture</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="image"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "image",
                                  e?.target?.id
                                );
                              }

                              e.target.classList.remove("highlight");
                            }}
                            onDragOver={(e) => {
                              e.target.classList.add("highlight");

                              e.preventDefault();
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.target.classList.remove("highlight");
                            }}
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files?.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "image",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="image"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only png, jpeg, and jpg are allowed. A maximum of 3
                            pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.image}
                          </small>
                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "image" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                    <div className="d-flex justify-content-start align-items-center ">
                                      <img
                                        src={item.imageReaderURL}
                                        className="image-upload-file me-3"
                                      />
                                    </div>

                                    <div className="w-100">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <p className="img-name text-tarute">
                                            {item?.pdfFile?.name}
                                          </p>
                                          <p className="img-name">
                                            {(
                                              item?.pdfFile?.size / 1024
                                            )?.toFixed(2)}
                                            KB
                                          </p>
                                          {/* {imgloadin} */}
                                        </div>

                                        <div
                                          onClick={() =>
                                            removeSelectedDoc(
                                              item?.pdfFile?.name,
                                              "image",
                                              index
                                            )
                                          }
                                          className="cursor"
                                        >
                                          <i className="fa-solid fa-trash-can"></i>
                                        </div>
                                      </div>

                                      <div className="d-flex  align-items-center">
                                        <progress
                                          className="w-100"
                                          id="progressBar"
                                          max="100"
                                          value={item?.onprogress || 0}
                                          // value="30"
                                          imgloadin
                                        ></progress>
                                        {item?.onprogress}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            // </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("profilePicReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit for review</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
