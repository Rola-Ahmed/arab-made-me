
more details pages in dashboard
-- fix data in quoation (timedeliveryDate)
--fix loggedIn Status 
-- fix current user in navbar (Add admin section)
D:\documents\arab-made-sourcing-tree\client\src\components\ViewMoreDetailsFormDash\OffersFacEtc\OffersFacEtc.jsx

--D:\documents\arab-made-sourcing-tree\client\src\components\Importerdashboard\subComponets\GetQuotationImp\GetQuotationImp.jsx
img


--D:\documents\arab-made-sourcing-tree\client\src\components\Importerdashboard\subComponets\PurchasingOrdersImp\PurchasingOrdersImp.jsx
 img


 --D:\documents\arab-made-sourcing-tree\client\src\components\Importerdashboard\subComponets\RfqImporter\RfqImporter.jsx
 img



 --import yourBrand from "../../assets/images/yourBrand.png";
remove
maxBodyLength: Infinity,




<!-- akram -->
-{{base_url}}/factories/factory/privateLabelings/30

- cant get single quotations
http://51.112.99.212:5007/api/v1/factories/factory/quotations/55




<!-- import StarRating from "js/stars"; -->
setUniqueFactoryIDofProducts
setUniqueProductId
:Jan, 20,2020 -
:5000
{/* {getRandomNumber(3, 5, 2)} */}


matchedObject

DashBoard: -
fix: timeForDelivery  returns undefined
fix qoutation to display if it is in privATE label id, rfqID




shippingConditions: "EXW", //required,
    packingConditions: "box", //req
    paymentType: "advancePayment", //req


    
<!-- -------------------------------------------------------------- -->
  // async function fetchReqDataORIGI() {
  //   setapiLoadingData(true);

  //   let ReqDataconfig = {
  //     method: "get",
  //     url: `${baseUrl}/privateLabelings/${privateLabelId}?include=importer`,
  //     headers: {
  //       authorization: isLogin,
  //     },
  //   };

  //   let QouteIdConfig = {
  //     method: "get",
  //     url: `${baseUrl}/quotations/one/byFormId?privateLabelingId=${privateLabelId}`,
  //     headers: {
  //       authorization: isLogin,
  //     },
  //   };

  //   axios
  //     .all([axios(ReqDataconfig), axios(QouteIdConfig)])
  //     .then(
  //       axios.spread((response1, response2) => {
  //         if (response1.data.message == "done") {

  //           setRequestedData({
  //             ...response1.data.privatelabelings,
  //             // qouteId: response2.data.quotations?.id,
  //           });
  //         }
  //         if (response2.data.message == "done") {
  //           // setRequestedData({
  //           //   // ...response1.data.privatelabelings,
  //           //   qouteId: response2.data.quotations?.id,
  //           // });
  //         }
  //         // else {
  //         //   setapiLoadingData(true);
  //         // }

  //         // setIsLoading(false);
  //       })
  //     )
  //     .catch((error) => {
  //       setapiLoadingData(true);
  //     });
  // }





<!-- ---------------------------------------------------------- -->



             // class="   fa-solid fa-ellipsis-vertical "
                              // onMouseEnter={() => {
                              //   document
                              //     .getElementById("factoryitem?.id")
                              //     .classList.add("d-block");

                              //   console.log(
                              //     "dedeed",
                              //     document.getElementById("factoryitem?.id"),
                              //     document
                              //       .getElementById("factoryitem?.id")
                              //       .classList.add("d-block")
                              //   );
                              // }}












                                // onmouseout={() => {
                            //   setTimeout(() => {
                            //     document
                            //       .getElementById(factoryitem?.id)
                            //       .classList.toggle("d-block");
                            //   }, 500); // Adjust the delay time as needed
                            // }}


















 function newNn(textValue) {
    setIsLoading(true);
    let data = {
      minQuantity: textValue.minQuantity,
      price: textValue.price,

      qualityConditions:
        textValue.qualityConditions == "other"
          ? textValue.qualityConditionsOther
          : textValue.qualityConditions,

      shippingConditions: textValue.shippingConditions,

      packingConditions:
        textValue.packingConditions === "other"
          ? textValue.packingConditionsOther
          : textValue.packingConditions,

      paymentTerms:
        textValue.paymentType == "other"
          ? textValue.paymentTypeOther
          : textValue.paymentType,

      // timeForDelivery: apiDetails?.timeForDelivery,
    };

    if (textValue.discounts !== "") {
      data.discounts = textValue.discounts;
    }

    if (textValue.notes !== "") {
      data.notes = textValue.notes;
    }
    if (textValue.startDeliveryDate !== "") {
      data.timeForDelivery["start"] = textValue.startDeliveryDate;
    }
    if (textValue.endDeliveryDate !== "") {
      data.timeForDelivery["end"] = textValue.endDeliveryDate;
    }

    const dataForAPI2 = {
      /* Data for API 2 */
    };

    Promise.all([
      fetch(`${baseUrl}/quotations/${apiDetails?.id}`, {
        method: "put",
        headers: {
          authorization: isLogin,
        },
        data: data,
      }),
      // fetch("api_endpoint_2", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(dataForAPI2),
      // }),
    ])
      .then((responses) => {
        const promises = responses.map((response) => response.json());
        return Promise.all(promises);
        return console.log("responses.data.message",responses?.[0])
        if (responses.data.message == "done") {
          // console.log("responses.data", response.data);
          setErrorMsg((previousState) => {
            const { message, ...rest } = previousState;
            return rest;
          });
          setDataAdded(true);
          setIsLoading(true);

          updateCoverImage();
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: responses.data.message,
          }));
          return;
        }

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start", // or 'center' or 'end' or 'nearest'
        });

        setIsLoading(false);
        console.log("done",responses.data)
      })
      // .then((data) => {
      //   const dataFromAPI1 = data[0];
      //   const dataFromAPI2 = data[1];

      //   // Handle responses from both APIs
      //   console.log("Data from API 1:", dataFromAPI1);
      //   console.log("Data from API 2:", dataFromAPI2);
      // })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }


















     "start": "set PORT=4000 && react-scripts start",


        `${baseUrl}/factories/products/${factoryId}?size=7`






  // Extract specific attributes (id, name, coverImage) and filter out the rest
        const filteredAttributes = result.data.products.map((item) => {
          // Extract specific attributes
          const { id, name, coverImage } = item;

          // Filter out other attributes
          // const otherAttributes = Object.keys(item)
          //   .filter((key) => !["id", "name", "coverImage"].includes(key))
          //   .reduce((obj, key) => {
          //     obj[key] = item[key];
          //     return obj;
          //   }, {});

          return {
            id,
            name,
            coverImage,
            // otherAttributes, // Optionally include other attributes in the result
          };
        });