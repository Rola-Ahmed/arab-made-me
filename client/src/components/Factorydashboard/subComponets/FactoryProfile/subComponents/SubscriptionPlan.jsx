import React from "react";
import {
  PremiumSubscription,
  GoldSubscription,
  standardSubscription,
  freeSubscription,
  SubscriptionDetails,
} from "constants/SubscriptionDetails.js";

export default function SubscriptionPlan() {
  return (
    <>
      <div id="subscriptionPlan"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          {" "}
          <p>subscription Plan</p>
          <div className="w-100 ">
            {" "}
            <div className="row">
              {/* subscription plan */}
              <div className="col-4  ">
                <div className="d-grid justify-content-between align-items-center form-control text-center  p-0 overflow-hidden">
                  <label
                    className={`plan-title titleBg text-center sub-title  py-1`}
                  >
                    Subscription Plan
                  </label>
                  <div className={`styleSubscribe.rowMargin plan-gap`}>
                    {SubscriptionDetails?.map((item, index) => (
                      <label
                        className="border-bottom sub-describtion d-flex justify-content-center align-items-center"
                        key={index}
                      >
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/*freeSubscription  */}
              <div className="col-2  ">
                <div className=" hoverCss active p-0 justify-content-between align-items-center form-control text-center">
                  <label
                    className={`active plan-title titleBg activeFree text-center sub-title  py-1`}
                  >
                    {" "}
                    Free
                  </label>

                  <div className={`plan-gap`}>
                    {freeSubscription.map((item, index) => (
                      <label
                        className="border-bottom    d-flex justify-content-center align-items-center"
                        key={index}
                      >
                        {item}
                      </label>
                    ))}

                    <div className="d-flex justify-content-center align-items-center w-100  h-100">
                      {" "}
                      <button className={`plan-btn btn-active p-1  m-1  `}>
                        <p> Current Plan</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/*StandardSubscription  */}
              <div className="col-2  ">
                <div className="p-0 hoverCss justify-content-between align-items-center form-control text-center">
                  <label
                    className={` plan-title titleBg standard text-center sub-title  py-1`}
                  >
                    {" "}
                    Standard
                  </label>
                  <div className={`plan-gap`}>
                    {standardSubscription.map((item, index) => (
                      <label
                        className="border-bottom p d-flex justify-content-center align-items-center"
                        key={index}
                      >
                        {item}
                      </label>
                    ))}

                    <div className="d-flex justify-content-center align-items-center w-100  h-100">
                      {" "}
                      <button className={`plan-btn p-1  m-1  `}>
                        <p> Upgrade now</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/*gOLDSubscription  */}
              <div className="col-2  ">
                <div className="p-0 hoverCss justify-content-between align-items-center form-control text-center">
                  <label
                    className={` plan-title  titleBg Gold text-center sub-title  py-1`}
                  >
                    {" "}
                    gold
                  </label>
                  <div className={`plan-gap`}>
                    {GoldSubscription.map((item, index) => (
                      <label
                        className="border-bottom   d-flex justify-content-center align-items-center"
                        key={index}
                      >
                        {item}
                      </label>
                    ))}

                    <div className="d-flex justify-content-center align-items-center w-100  h-100">
                      {" "}
                      <button className={`plan-btn p-1  m-1  `}>
                        <p> Upgrade now</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/*PremiumSubscription  */}
              <div className="col-2  ">
                <div className="p-0 hoverCss justify-content-between align-items-center form-control text-center">
                  <label
                    className={`plan-title titleBg Premium text-center sub-title  py-1`}
                  >
                    {" "}
                    Premium
                  </label>
                  <div className={`plan-gap`}>
                    {PremiumSubscription.map((item, index) => (
                      <label
                        className="border-bottom   d-flex justify-content-center align-items-center "
                        key={index}
                      >
                        {item}
                      </label>
                    ))}

                    <div className="d-flex justify-content-center align-items-center w-100  h-100">
                      {" "}
                      <button className={`plan-btn p-1  m-1  `}>
                        <p> Upgrade now</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
