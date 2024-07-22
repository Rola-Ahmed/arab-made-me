import { useContext, useEffect, useState } from "react";
import { UserToken } from "Context/userToken";
import axios from "axios";
import { baseUrl } from "config.js";
import Factorydash from "components/Factorydashboard/Factorydash";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

export default function FactorydashContainer() {
  const { setIsLogin, isLogin } = useContext(UserToken);

  // Fetch notifications
  const [notification, setNotification] = useState([]);

  // Context

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch private labelings
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/privateLabelings`,
          {
            headers: { authorization: isLogin },
          }
        );
        if (response1.data.message === "done") {
          const openPrivateLabelingsCount =
            response1.data.privateLabelings.filter(
              (item) => item.status === "open"
            ).length;
          setNotification((prev) => ({
            ...prev,
            PrivateLabelingsNotif: openPrivateLabelingsCount,
          }));
        }

        // Fetch RFQs
        const response2 = await axios.get(`${baseUrl}/factories/factory/rfqs`, {
          headers: { authorization: isLogin },
        });
        if (response2.data.message === "done") {
          const countNotif = response2.data.rfqs.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, rfqsNotif: countNotif }));
        }

        // Fetch SPMFs
        const response3 = await axios.get(
          `${baseUrl}/factories/factory/spmfs`,
          {
            headers: { authorization: isLogin },
          }
        );

        if (response3.data.message === "done") {
          const countNotif = response3.data.spmfs.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, spmfsNotif: countNotif }));
        }

        // Fetch Factory Visit req
        const response4 = await axios.get(
          `${baseUrl}/factories/factory/visits`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response4.data.message === "done") {
          const countNotif = response4.data.visits.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, visitsNotif: countNotif }));
        }

        // Fetch pos
        const response5 = await axios.get(`${baseUrl}/factories/factory/pos`, {
          headers: {
            authorization: isLogin,
          },
        });

        if (response5.data.message === "done") {
          const countNotif = response5.data.pos.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, posNotif: countNotif }));
        }

        // Fetch offers
        const response6 = await axios.get(
          `${baseUrl}/factories/factory/offers`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response6.data.message === "done") {
          const countNotif = response6.data.offers.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, offersNotif: countNotif }));
        }

        // Fetch quotations
        const response7 = await axios.get(
          `${baseUrl}/factories/factory/quotations`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response7.data.message === "done") {
          const countNotif = response7.data.quotations.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, quotationsNotif: countNotif }));
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchNotifications();
  }, [isLogin]);

  // if (!isLogin) {
  //   return (
  //     <IsLoggedIn
  //       show={true}
  //       // onHide={() =>
  //       //   setModalShow((prevVal) => ({
  //       //     ...prevVal,
  //       //     isLogin: false,
  //       //   }))
  //       // }
  //       distination={`/signin`}
  //     />
  //   );
  // }

  return <Factorydash notification={notification} />;
}
