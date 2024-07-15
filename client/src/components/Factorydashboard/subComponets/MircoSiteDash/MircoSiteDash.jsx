import { useEffect, useState, useContext, useReducer } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import { errorHandler } from "utils/errorHandler";

import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Carousel from "react-grid-carousel";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";
import { countriesMiddleEast } from "constants/countries";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import FactoryInforamtion from "./subComponents/FactoryInforamtion";
import Team from "./subComponents/Team";
import SocialAccounts from "./subComponents/SocialAccounts";
import FactoryLogo from "./subComponents/FactoryLogo";

export default function MircoSiteDash() {
  document.title = "Factory Profile";

  let { isLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState();

  let { currentUserData } = useContext(userDetails);
  const setFactoryProfile = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case "fetched_update_data":
        return {
          ...state,
          ...action.value,
        };

      case "fetch_team_data":
        return {
          ...state,
          teamMembers: action.value,
        };

      case "delete_Team":
        let updateTeam = state?.teamMembers;
        updateTeam.splice(action.index, 1);
        return {
          ...state,
          teamMembers: updateTeam,
        };

      case "add_Team":
        let updateTeamArr = state?.teamMembers;
        updateTeamArr.push(action.value);
        return {
          ...state,
          teamMembers: updateTeamArr,
        };

      case "update_image":
        return {
          ...state,
          legalDocs: action.value,
        };

      default:
        return state;
    }
  };

  const [factoryProfile, dispatch] = useReducer(reducer, setFactoryProfile);

  function deleteTeam(data) {
    dispatch({ type: "delete_Team", index: data });
  }
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  // slider setting

  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   keyWord: null,
    //   pdfFile: null,
    // blob:
    // },
  ]);

  function handleMultiMediaValidation(e, keyWordDoc, inputValue) {
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === keyWordDoc
    )?.length;

    if (count == 1 && (keyWordDoc == "coverImage" || keyWordDoc == "image")) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 1`,
      }));
      return;
    }

    if (count >= 3 && keyWordDoc == "qualityCertificates") {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 3`,
      }));
      return;
    }

    if (count >= 3 && keyWordDoc == "images") {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 8`,
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

    if (keyWordDoc == "qualityCertificates") {
      acceptedExtensions = ["png", "jpeg", "jpg"];
    } else if (
      keyWordDoc == "images" ||
      keyWordDoc == "coverImage" ||
      keyWordDoc == "image"
    ) {
      acceptedExtensions = ["png", "jpeg", "jpg"];
    } else if (keyWordDoc == "coverVideo") {
      acceptedExtensions = ["mp4", "mkv"];
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

  // api
  async function fetchFactoryPage() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        dispatch({
          type: "fetched_update_data",
          value: response.data.factories,
        });
        fetchTeamData();
      } else if (response.data.message == "404 Not Found") {
        // errorMsg("404");
      }
    } catch (error) {}
  }

  async function fetchTeamData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/teams/factory/${currentUserData.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        dispatch({
          type: "fetch_team_data",
          value: response.data.teamMembers,
        });
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
      url: `${baseUrl}/factories/media`,
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
          toast("Media Saved Successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            //pauseOnHover: true,
            draggable: true,
            theme: "colored",
            type: "success",
          });
          dispatch({
            type: "fetched_update_data",
            value: response.data.factory,
          });

          //
          setSelectedDocs([]);
          setIsLoading(false);
          setTeamIsAdded({
            status: false,
            id: "",
          });
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
      });
  }

  useEffect(() => {
    fetchFactoryPage();
  }, [currentUserData?.factoryId]);

  // update data

  let nameValidation = Yup.string()
    .required("Input Field is Required")
    .max(25, "max length is 25");
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  const [show, setShow] = useState({
    factoryInfoChangeReadOnly: false,
    socialAccountsReadOnly: false,
    legalDocsReadOnly: false,
    qualityCertificatesReadOnly: false,
    coverImgReadOnly: false,
    newTeamReadOnly: false,
    coverVideo: false,
  });

  const initialFactoryInfoValidation = {
    //---------------------- Factory Info
    factoryName: factoryProfile?.name || "",
    yearOfEstablishmint: factoryProfile?.yearOfEstablishmint || "",
    city: factoryProfile?.city || "",
    country: factoryProfile?.country || countriesMiddleEast?.[0].code,
    yearlySalesIncome: factoryProfile?.yearlySalesIncome || "",

    // YearlyIncome:factoryProfile?.YearlyIncome ||"",
    // phone number
    numberOfEmployees: factoryProfile?.numberOfEmployees || "", //select optiton
    taxRegisterationNumber: factoryProfile?.taxRegisterationNumber || "",
    commercialRegisterationNumber:
      factoryProfile?.commercialRegisterationNumber || "",
    address: factoryProfile?.address?.[0] || "",
    description: factoryProfile?.description || "",
    whyUs: factoryProfile?.whyUs || "",

    factoryPhoneCode:
      factoryProfile?.phone?.slice(0, 3) || countriesMiddleEast?.[0]?.phoneCode,
    factoryPhone: factoryProfile?.phone?.slice(3) || "",
    importingCountries: factoryProfile?.importingCountries || [],
  };

  let factoryInfoValidation = useFormik({
    initialValues: initialFactoryInfoValidation,
    validationSchema: Yup.object().shape({
      factoryName: nameValidation,
      yearOfEstablishmint: Yup.string()
        // .required("Input Field is Required")
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(4, "min length is 4")
        .max(4, "max length is 4"),

      taxRegisterationNumber: Yup.string()
        // .required("Input Field is Required")
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(8, "min length is 8")
        .max(16, "max length is 16"),
      commercialRegisterationNumber: Yup.string()
        // .required("Input Field is Required")
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(8, "min length is 8")
        .max(16, "max length is 16"),

      address: Yup.string()
        // .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),

      description: Yup.string()
        .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),
      whyUs: Yup.string()
        // .required("Input Field is Required")
        .min(6, "min length is 6")
        .max(255, "max length is 255"),
      factoryPhone: phoneValidation,
      importingCountries: Yup.array().of(Yup.string()).nullable(),
    }),
    onSubmit: submitForm,
  });

  // social links
  const initialSocialAccount = {
    // social links
    instagramLink: factoryProfile?.socialLinks?.instagram || "",
    facebookLink: factoryProfile?.socialLinks?.facebook || "",
    website: factoryProfile?.website || "",
  };
  let SocialAccountValidation = useFormik({
    initialValues: initialSocialAccount,
    validationSchema: Yup.object().shape({
      website: Yup.string().url("Invalid URL format"),
      instagramLink: Yup.string().url("Invalid URL format"),
      facebookLink: Yup.string().url("Invalid URL format"),
    }),
    onSubmit: submitForm,
  });

  const initialTeamValues = {
    //---------------------- Factory Info
    teamName: "",
    teamRole: "",
  };
  let teamValidation = useFormik({
    initialValues: initialTeamValues,
    validationSchema: Yup.object().shape({
      teamName: nameValidation,
      teamRole: nameValidation,
    }),
    onSubmit: submitTeam,
  });

  // there is 2 apis that i update
  //  1st api for user data
  // 2nd api for image
  // i need to wait for the success state for the 1st api inorder to pass the id to image api
  // if 1st api is success & meida api is failur then i need to pop a messsage and i only need to update the media api
  // so !teamIsAdded.status conditon checks if team data is added so it wont add again the same user

  let [teamIsAdded, setTeamIsAdded] = useState({
    status: false,
    id: "",
  });

  async function submitTeam(values) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {
      name: values.teamName,
      role: values.teamRole,
    };

    if (!teamIsAdded.status) {
      try {
        setIsLoading(true);
        let config = {
          method: "post",
          url: `${baseUrl}/teams/add`,
          headers: {
            authorization: isLogin,
          },
          data: data,
        };

        const response = await axios.request(config);
        setIsLoading(false);

        if (response.data.message == "done") {
          // check if the inputs contain meida then call media api & pass the member team id
          // else inputs doesnt contain meida so display successs message
          if (selectedDocs.length > 0) {
            setTeamIsAdded({
              status: true,
              id: response.data.teamMember.id,
            });

            await SubmitDocs(response.data.teamMember.id);
          } else {
            setIsLoading(false);
            setTeamIsAdded({
              status: false,
              id: "",
            });

            teamValidation.resetForm({
              values: initialTeamValues,
            });

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

            ModalClose();
            dispatch({ type: "add_Team", value: response.data.teamMember });
          }
        } else {
          setIsLoading(false);
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));
        }
      } catch (error) {
        setIsLoading(false);

        // if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')|| error.code === 'net::ERR_CONNECTION_RESET' || error.message.includes('net::ERR_CONNECTION_RESET')) {
        //   // Handle network-related error
        //   console.error('Network error:', error);
        //   // Display a user-friendly message or take appropriate action
        // }
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: errorHandler(error),
        }));
      }
    }

    if (teamIsAdded.status && selectedDocs?.length > 0) {
      setIsLoading((prev) => ({
        ...prev,
        submitLoading: true,
      }));
      SubmitDocs(teamIsAdded.id);
    }
  }

  function SubmitDocs(productId) {
    // e.preventDefault();
    setIsLoading(true);

    let data = new FormData();

    selectedDocs?.map((item) => data.append("image", item.pdfFile));

    const config = {
      method: "patch",
      url: `${baseUrl}/teams/uploadMedia/${productId}`,
      headers: {
        Authorization: isLogin,
        // "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          teamValidation.resetForm({
            values: initialTeamValues,
          });
          setTeamIsAdded({
            status: false,
            id: "",
          });
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

          dispatch({ type: "add_Team", value: response.data.teamMember });

          setIsLoading(false);
          setSelectedDocs([]);
          ModalClose();
        } else {
          setIsLoading(false);

          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));
          // const targetElement = document.getElementById("view");
          // targetElement.scrollIntoView({
          //   behavior: "smooth",
          //   block: "start",
          // });
        }
      })

      .catch((error) => {
        setIsLoading(false);
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: errorHandler(error),
        }));

        window.scrollTo({ top: 920 });
      });
  }

  async function submitForm(values) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {};
    // cotinue

    if (show?.factoryInfoChangeReadOnly) {
      data = {
        name: values.factoryName,
        country: values.country,
        // /optional
        yearOfEstablishmint: values.yearOfEstablishmint,
        city: values.city,
        numberOfEmployees: values.numberOfEmployees,
        commercialRegisterationNumber: values.commercialRegisterationNumber,
        taxRegisterationNumber: values.taxRegisterationNumber,

        description: values.description,
        address: [values.address],
      };
      if (values.whyUs !== "") {
        data.whyUs = `${values.whyUs}`;
      }
      if (values.importingCountries.length !== 0) {
        data.importingCountries = values.importingCountries;
      }

      if (values.factoryPhone !== "") {
        data.phone = `${values.factoryPhoneCode}${values.factoryPhone}`;
      }

      if (values.yearlySalesIncome !== "") {
        data.yearlySalesIncome = values.yearlySalesIncome;
      }
    }

    if (show?.socialAccountsReadOnly) {
      data = {
        socialLinks: {},
        website: values.website,
      };

      data.website = values.website;
      data.socialLinks["facebook"] = values.facebookLink;
      data.socialLinks["instagram"] = values.instagramLink;
    }

    try {
      setIsLoading(true);
      let config = {
        method: "put",
        url: `${baseUrl}/factories/update/fromUser`,
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

        dispatch({
          type: "fetched_update_data",
          value: data,
        });
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: errorHandler(error),
      }));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (factoryProfile && factoryProfile.length !== 0) {
      SocialAccountValidation.setValues(initialSocialAccount);
      factoryInfoValidation.setValues(initialFactoryInfoValidation);
      teamValidation.setValues(initialTeamValues);
    }
  }, [factoryProfile]);

  console.log("teamValidation", teamValidation);
  const [activeMenu] = useOutletContext();

  useEffect(() => {
    const hash = window.location.hash;

    // Check if there is a hash in the URL
    if (hash) {
      // Remove the '#' character to get the ID
      const targetId = hash.substring(1);

      // Get the target element by ID
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Scroll to the target element
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [activeMenu]);

  function handleClose(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: false,
    }));
    // Reset the form and clear validation errors
    // formValidation.resetForm();

    // reset to initaliz the values
    teamValidation.resetForm(initialTeamValues);
    SocialAccountValidation.resetForm({
      values: initialSocialAccount, // Optional: Reset values to an empty object
      errors: {}, // Optional: Reset errors to an empty object
      touched: {}, // Optional: Reset touched to an empty object
      status: undefined, // Optional: Reset status to undefined
      isSubmitting: false, // Optional: Reset isSubmitting to false
      isValidating: false, // Optional: Reset isValidating to false
      submitCount: 0, // Optional: Reset submitCount to 0
    });

    factoryInfoValidation.resetForm({
      values: initialFactoryInfoValidation,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    setSelectedDocs([]);
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }
  function ModalClose() {
    setShow((prevVal) => {
      const newState = { ...prevVal }; // Create a copy of the previous state

      // Iterate through the keys in the state
      Object.keys(newState).forEach((key) => {
        newState[key] = false; // Set each property to false
      });

      return newState; // Return the updated state
    });

    //  setTeamIsAdded({
    //           status: false,
    //           id: "",
    //         });
  }

  return (
    <>
      <div className="section factory-profile  ms-5 me-5 mb-5 mt-2">
        <PageUtility currentPage="Mirco Site" />
        {/*  */}

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* factory logo  container 1 */}
              <FactoryLogo
                baseUrl_IMG={baseUrl_IMG}
                handleImageError={handleImageError}
                handleShow={handleShow}
                factoryProfile={factoryProfile}
              />

              {/*Social Accounts container 2 */}
              <SocialAccounts handleShow={handleShow} Button={Button} />

              {/* Factory Banners */}

              <div id="factoryimages"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Factory Banners</p>
                  <div className="w-100 h-100  ">
                    {/* ----------------------- */}
                    <div className="row  ">
                      <div className="col-12">
                        {factoryProfile?.images !== null ? (
                          <Carousel
                            className
                            cols={4}
                            rows={1}
                            gap={10}
                            scrollSnap={true}
                            loop
                            showDots
                            hideArrow={false}
                          >
                            {factoryProfile?.images?.map((item) => (
                              <Carousel.Item>
                                <div
                                  className="dots-slider-img-2 w-100 cursor"
                                  onClick={() =>
                                    setShowImagePop({
                                      display: true,
                                      imagePath: `${baseUrl_IMG}/${item}`,
                                    })
                                  }
                                >
                                  <img
                                    className="h-100 w-100 "
                                    id={handleImageError}
                                    src={`${baseUrl_IMG}/${item}`}
                                    alt="Img"
                                    onError={handleImageError}
                                  />
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("imagesReadOnly")}
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

              {/*Certificats  */}
              <div id="certificates"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Certificates</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        {factoryProfile?.qualityCertificates ? (
                          <Carousel
                            cols={2}
                            rows={1}
                            gap={10}
                            scrollSnap={true}
                            loop
                            showDots
                            hideArrow={false}
                          >
                            {factoryProfile?.qualityCertificates?.map(
                              (item) => (
                                <Carousel.Item>
                                  <div
                                    className="dots-slider-img w-100 cursor"
                                    onClick={() =>
                                      setShowImagePop({
                                        display: true,
                                        imagePath: `${baseUrl_IMG}/${item}`,
                                      })
                                    }
                                  >
                                    <img
                                      className="h-100 w-100  "
                                      id={handleImageError}
                                      src={`${baseUrl_IMG}/${item}`}
                                      alt="Img"
                                      onError={handleImageError}
                                    />
                                  </div>
                                </Carousel.Item>
                              )
                            )}
                          </Carousel>
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() =>
                            handleShow("qualityCertificatesReadOnly")
                          }
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

              {/* Cover Video  */}
              <div id="CoverVideo"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Cover Video</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12 h-fit-content">
                        {factoryProfile?.coverVideo ? (
                          <video
                            controls="controls"
                            autoPlay={false}
                            muted={true}
                            className="h-75 w-100  "
                            id={handleImageError}
                            src={`${baseUrl_IMG}/${factoryProfile?.coverVideo}`}
                            alt="Cover Video"
                            onError={handleImageError}
                          />
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("coverVideo")}
                        >
                          <p className="cursor">Upload </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end new */}

              {/*  FACTORY iNFO*/}

              <FactoryInforamtion
                handleShow={Button}
                Button={Button}
                factoryProfile={factoryProfile}
              />

              {/* Teammmmm */}

              <Team
                handleShow={handleShow}
                Button={Button}
                factoryProfile={factoryProfile}
                isLogin={isLogin}
                toast={toast}
                deleteTeam={deleteTeam}
              />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------------------------------- */}
      {/* Factory Info Modal update form */}
      <form onSubmit={factoryInfoValidation.handleSubmit}>
        <Modal
          show={show.factoryInfoChangeReadOnly}
          onHide={() => handleClose("factoryInfoChangeReadOnly")}
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
                    <p>Factory Inforamtion</p>
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
                  <form>
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Factory Name</label>

                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Factory Name"
                              id="factoryName"
                              onChange={factoryInfoValidation.handleChange}
                              onBlur={factoryInfoValidation.handleBlur}
                              value={factoryInfoValidation.values.factoryName}
                            />
                            {factoryInfoValidation.errors.factoryName &&
                            factoryInfoValidation.touched.factoryName ? (
                              <small className="text-danger">
                                {factoryInfoValidation.errors.factoryName}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>Year Of Establishment</label>
                          <input
                            // type="text"
                            placeholder="Enter Year Of Establishment"
                            className="form-control"
                            id="yearOfEstablishmint"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values.yearOfEstablishmint
                            }
                          />
                          {factoryInfoValidation.errors.yearOfEstablishmint &&
                          factoryInfoValidation.touched.yearOfEstablishmint ? (
                            <small className="text-danger">
                              {factoryInfoValidation.errors.yearOfEstablishmint}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>Country</label>
                          <select
                            className="form-select form-control"
                            onChange={factoryInfoValidation.handleChange}
                            id="country"
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.country}
                            // defaultValue={factoryProfile?.country}
                          >
                            {/* <option value={"sa"}>
                              {factoryProfile?.country}
                            </option> */}

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
                            placeholder="Enter Year Of Establishment"
                            className="form-control"
                            id="city"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.city}
                          />
                          {factoryInfoValidation.errors.city &&
                          factoryInfoValidation.touched.city ? (
                            <small className="text-danger">
                              {factoryInfoValidation.errors.city}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Yearly Sales Income</label>
                          <select
                            className="form-select form-control"
                            onChange={factoryInfoValidation.handleChange}
                            id="yearlySalesIncome"
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values.yearlySalesIncome
                            }
                          >
                            <option value=" ">
                              Select Yearly Sales Income
                            </option>
                            <option value="less than USD 1M ">
                              Less Than USD 1M
                            </option>
                            <option value="USD 1M-5M">USD 1M-5M</option>
                            <option value="USD 5M-10M">USD 5M-10M</option>
                            <option value="USD 10M-50M">USD 10M-50M</option>
                            <option value="USD 50M-100M">USD 50M-100M</option>
                            <option value="USD 100M-500M">USD 100M-500M</option>
                            <option value="USD 500M-1B">USD 500M-1B</option>
                            <option value="More than 1B USD">
                              More Than 1M USD
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Number of employees</label>

                          <select
                            className="form-select form-control"
                            onChange={factoryInfoValidation.handleChange}
                            id="numberOfEmployees"
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values.numberOfEmployees
                            }
                          >
                            <option value="">Select Number of employees</option>

                            <option value="1-10">1-10 Employess</option>
                            <option value="11-50 ">11-50 Employess</option>
                            <option value="51 - 100">51 - 100 Employess</option>
                            <option value="101 - 500">
                              101 - 500 Employess
                            </option>
                            <option value="501-1000">501-1000 Employess</option>
                            <option value="More than 1000">
                              More than 1000 Employess
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Business Registration Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="taxRegisterationNumber"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values
                                .taxRegisterationNumber
                            }
                          />
                          {factoryInfoValidation.errors
                            .taxRegisterationNumber &&
                          factoryInfoValidation.touched
                            .taxRegisterationNumber ? (
                            <small className="text-danger">
                              {
                                factoryInfoValidation.errors
                                  .taxRegisterationNumber
                              }
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
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values
                                .commercialRegisterationNumber
                            }
                          />
                          {factoryInfoValidation.errors
                            .commercialRegisterationNumber &&
                          factoryInfoValidation.touched
                            .commercialRegisterationNumber ? (
                            <small className="text-danger">
                              {
                                factoryInfoValidation.errors
                                  .commercialRegisterationNumber
                              }
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Facatory Phone Number</label>
                            <div className="input-group  h-100">
                              <div className="input-group-prepend">
                                <select
                                  className="input-group-text h-100 p-2 m-0 phone-borders"
                                  id="factoryPhoneCode"
                                  name="factoryPhoneCode"
                                  placeholder="1113534343"
                                  onChange={factoryInfoValidation.handleChange}
                                  value={
                                    factoryInfoValidation.values
                                      .factoryPhoneCode
                                  }
                                  onBlur={factoryInfoValidation.handleBlur}
                                >
                                  {/* <select className="input-group-text h-100  m-0" name="" id=""> */}

                                  {countriesMiddleEast.map((phoneItem) => (
                                    <option value={phoneItem.phoneCode}>
                                      {phoneItem.phoneCode}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <input
                                type="text"
                                className="form-control phone-border"
                                id="factoryPhone"
                                name="factoryPhone"
                                placeholder="1113534343"
                                onChange={factoryInfoValidation.handleChange}
                                value={
                                  factoryInfoValidation.values.factoryPhone
                                }
                                onBlur={factoryInfoValidation.handleBlur}
                              />
                            </div>
                            {factoryInfoValidation.errors.factoryPhone &&
                            factoryInfoValidation.touched.factoryPhone ? (
                              <small className="form-text text-danger">
                                {factoryInfoValidation.errors.factoryPhone}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Factory Location</label>
                          <input
                            className="form-control"
                            id="address"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.address}
                          />
                          {factoryInfoValidation.errors.address &&
                          factoryInfoValidation.touched.address ? (
                            <small className="text-danger">
                              {factoryInfoValidation.errors.address}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>exporting Countries</label>

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
                                    onChange={
                                      factoryInfoValidation.handleChange
                                    }
                                    className="form-check-input cursor me-3 "
                                    type="checkbox"
                                    name="importingCountries"
                                    id="importingCountries"
                                    value={item.code}
                                    defaultChecked={factoryProfile?.importingCountries?.some(
                                      (type) =>
                                        item.code
                                          .toLowerCase()
                                          .includes(type.toLowerCase())
                                    )}
                                  />
                                  <label
                                    className="form-check-label p-0 m-0"
                                    htmlFor="importingCountries"
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
                          <label>Factory description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            id="description"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.description}
                          ></textarea>
                          {factoryInfoValidation.errors.description &&
                          factoryInfoValidation.touched.description ? (
                            <small className="text-danger">
                              {factoryInfoValidation.errors.description}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>Why Us</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            id="whyUs"
                            onChange={factoryInfoValidation.handleChange}
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.whyUs}
                          ></textarea>
                          {factoryInfoValidation.errors.whyUs &&
                          factoryInfoValidation.touched.whyUs ? (
                            <small className="text-danger">
                              {factoryInfoValidation.errors.whyUs}
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
                          onClick={() =>
                            handleClose("factoryInfoChangeReadOnly")
                          }
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
                          >
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
      </form>

      {/* Social Links update form */}
      <form onSubmit={SocialAccountValidation.handleSubmit}>
        <Modal
          show={show.socialAccountsReadOnly}
          onHide={() => handleClose("socialAccountsReadOnly")}
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
                    <p>Factory Inforamtion</p>
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
                  <form>
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

                            {/*  */}

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
                            {/*  */}
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
                                id="instagramLink"
                                onChange={SocialAccountValidation.handleChange}
                                onBlur={SocialAccountValidation.handleBlur}
                                value={
                                  SocialAccountValidation.values.instagramLink
                                }
                              />
                              {SocialAccountValidation.errors.instagramLink &&
                              SocialAccountValidation.touched.instagramLink ? (
                                <small className="text-danger">
                                  {SocialAccountValidation.errors.instagramLink}
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
                            <i className="fas fa-spinner fa-spin text-white px-5"></i>
                          </button>
                        ) : (
                          <button
                            className="btn-edit submitButton"
                            type="submit"
                          >
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
      </form>

      {/* Factory Banners */}
      <Modal
        show={show.imagesReadOnly}
        onHide={() => handleClose("imagesReadOnly")}
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
                  <p>Factory Banners</p>
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
                  onSubmit={(e) => updateMedia(e, "images")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          {/*  */}

                          {/*  */}

                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="fileInput"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "images"
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
                                  "images",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="fileInput"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only png, jpeg, and jpg are allowed. A maximum of 8
                            pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.images}
                          </small>

                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "images" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                    {/* <div> */}

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
                                              "images",
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
                        onClick={() => handleClose("imagesReadOnly")}
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
                          <p className="cursor">Submit</p>
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

      {/* Factory Banners */}
      <Modal
        show={show.coverImgReadOnly}
        onHide={() => handleClose("coverImgReadOnly")}
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
                  <p>Factory Logo</p>
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
                  onSubmit={(e) => updateMedia(e, "coverImage")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          {/*  */}

                          {/*  */}

                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="coverImageInput"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "coverImage",
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
                                  "coverImage",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="coverImageInput"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only png, jpeg, and jpg are allowed. A maximum of 1
                            pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.coverImage}
                          </small>
                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "coverImage" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                    {/* <div> */}

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
                                              "coverImage",
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
                        onClick={() => handleClose("coverImgReadOnly")}
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
                          <p className="cursor">Submit</p>
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

      {/* Certificaets qualityCertificates */}

      <Modal
        show={show.qualityCertificatesReadOnly}
        onHide={() => handleClose("qualityCertificatesReadOnly")}
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
                  <p>Certificates</p>
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
                  onSubmit={(e) => updateMedia(e, "qualityCertificates")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="qualityCertificates"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "qualityCertificates",
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
                                  "qualityCertificates",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="qualityCertificates"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only png, jpeg, and jpg are allowed. A maximum of 3
                            pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.qualityCertificates}
                          </small>
                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "qualityCertificates" && (
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
                                              "qualityCertificates",
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
                        onClick={() =>
                          handleClose("qualityCertificatesReadOnly")
                        }
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

      {/* Cover Video  */}

      <Modal
        show={show.coverVideo}
        onHide={() => handleClose("coverVideo")}
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
                  <p>Cover Video</p>
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
                  onSubmit={(e) => updateMedia(e, "coverVideo")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="coverVideo"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "coverVideo",
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
                                  "coverVideo",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="coverVideo"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only MP4 and MKV formats are allowed, with a maximum
                            of 1 video permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.coverVideo}
                          </small>
                          {selectedDocs.map(
                            (item, index) =>
                              item.keyWord === "coverVideo" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="  ">
                                    <div className="d-flex justify-content-start align-items-center ">
                                      <video
                                        // className="w-100 h-100"
                                        src={item.imageReaderURL}
                                        controls="controls"
                                        autoPlay={false}
                                        muted={true}
                                        className="w-100"
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
                                              "coverVideo",
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
                        onClick={() => handleClose("coverVideo")}
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
                          <p className="cursor">Submit Video</p>
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

      {/* new team */}

      <Modal
        show={show.newTeamReadOnly}
        onHide={() => handleClose("newTeamReadOnly")}
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
                  <p>Add New Team </p>
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
                  onSubmit={teamValidation.handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Member Name</label>
                        <input
                          className="form-control"
                          id="teamName"
                          onChange={teamValidation.handleChange}
                          onBlur={teamValidation.handleBlur}
                          value={teamValidation.values.teamName}
                        />
                        {teamValidation.errors.teamName &&
                        teamValidation.touched.teamName ? (
                          <small className="text-danger">
                            {teamValidation.errors.teamName}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Member Role</label>
                        <input
                          className="form-control"
                          id="teamRole"
                          onChange={teamValidation.handleChange}
                          onBlur={teamValidation.handleBlur}
                          value={teamValidation.values.teamRole}
                        />
                        {teamValidation.errors.teamRole &&
                        teamValidation.touched.teamRole ? (
                          <small className="text-danger">
                            {teamValidation.errors.teamRole}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

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
                            Only png, jpeg, and jpg are allowed. A maximum of 1
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
                        onClick={() => handleClose("newTeamReadOnly")}
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
                          // disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Add</p>
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

      <Modal
        show={showImagePop.display}
        // show={/true}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        className="factory-profile"
        dialogClassName="modal-90w"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div closeButton className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              {/* <p>Account Inforamtions</p> */}
              <Modal.Header closeButton></Modal.Header>

              <div className="w-100 ">
                <div className="row row-gap">
                  <img
                    src={showImagePop.imagePath}
                    alt={showImagePop.imagePath}
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
