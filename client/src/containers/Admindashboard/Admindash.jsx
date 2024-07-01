// UserContainer.js
import { useState, useEffect } from "react";
import axios from "axios";

import { baseUrl } from "config.js";

const UserContainer = () => {
  const [notification, setNotification] = useState([]);

  // Fetch users from API

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch private labelings
        const response1 = await axios.get(`${baseUrl}/privateLabelings`);
        if (response1.data.message === "done") {
          const openPrivateLabelingsCount =
            response1.data.privatelabelings.filter(
              (item) => item.status === "open"
            ).length;
          setNotification((prev) => ({
            ...prev,
            PrivateLabelingsNotif: openPrivateLabelingsCount,
          }));
        }

        // Fetch RFQs
        const response2 = await axios.get(`${baseUrl}/rfqs`);
        if (response2.data.message === "done") {
          const countNotif = response2.data.quotationrequests.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, rfqsNotif: countNotif }));
        }

        // Fetch SPMFs
        const response3 = await axios.get(`${baseUrl}/spmfs`);

        if (response3.data.message === "done") {
          const countNotif = response3.data.specialmanufacturingrequests.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, spmfsNotif: countNotif }));
        }

        // Fetch Factory Visit req
        const response4 = await axios.get(`${baseUrl}/visits`);

        if (response4.data.message === "done") {
          const countNotif = response4.data.visits.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, visitsNotif: countNotif }));
        }

        // Fetch pos
        const response5 = await axios.get(`${baseUrl}/pos`);

        if (response5.data.message === "done") {
          const countNotif = response5.data.purchasingorders.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, posNotif: countNotif }));
        }

        // Fetch offers
        const response6 = await axios.get(`${baseUrl}/sourcingOffers`);

        if (response6.data.message === "done") {
          const countNotif = response6.data.sourcingoffers.filter(
            (item) => item.status === "open"
          ).length;
          setNotification((prev) => ({ ...prev, offersNotif: countNotif }));
        }

        // Fetch quotations
        const response7 = await axios.get(`${baseUrl}/quotations`);

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
  }, []);

  return notification; // Return the fetched users data
};

export default UserContainer;
