import { Line } from "react-chartjs-2";
import "./DashBoard.css";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import ReactPaginate from "react-paginate";
import payemtIcon from "../../../../assets/images/Payment method icon.png";

import profile from "../../../../assets/images/Avatar (1).png";

export default function DashBoard() {
  const labels = [
    "Jan",
    "Febr",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [
          "10",
          "50",
          "65",
          "60",
          "200",
          "0",
          "100",

          "70",
          "400",
          "600",
          "800",
          "1000",
        ],
        // borderColor: "rgb(255, 99, 132)",
        // backgroundColor: "rgba(255, 99, 132, 0.5)",

        backgroundColor: "green",
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 0,
        borderDashOffset: 0,
        borderCapStyle: "rounded",
      },
      {
        label: "Dataset 2",
        data: [
          // "-1000",
          // "-800",
          // "-80",
          // "-50",
          // "-70",
          "0",
          "300",
          "68",
          "90",
          "90",
          "1000",
        ],
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        borderDashOffset: 0,
        borderCapStyle: "rounded",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, //allows  to customize the height
    scales: {
      y: {
        // min: -500, // Minimum value for the y-axis
        // max: 1000, // Maximum value for the y-axis
        // stepSize: 200,
        // labels:["0", "100", "200", "300", "400", "500"]
        // Specify y-axis options here
        // For example, to set specific values:
        // min: 0, // Minimum value for the y-axis
        // max: 1000, // Maximum value for the y-axis
        // stepSize: 200, // Interval between ticks on the y-axis

        ticks: {
          textStrokeWidth: 2,
          padding: 2,
          font: 1, // Set the font size for x-axis labels
          autoSkip: false, // Disable auto-skipping of ticks
          maxTicksLimit: 10, // Maximum number of ticks to display
          maxRotation: 45,
          // callback: (value) => ["0", "100", "200", "300", "400", "500"],
          callback: function (value, index, ticks) {
            if (value > 1000) {
              return;
            } else {
              return value + 500;
            }
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        // position: "top",
        display: true,
        // labels: {
        //   font: {
        //     size: 1,
        //   },
        // },
      },
      // plugins: {
      //   colors: {
      //     enabled: false,
      //   },
      //   //  legend and scales to hide the
      //   legend: {
      //     display: false, // This will hide the legend
      //   },
      // },
      title: {
        display: false,
        // text: "Chart.js Line Chart",
      },
    },
  };

  return (
    <div className="m-4 dash-home-section">
      <div className="header w-100">
        {/*  */}

        <PageUtility currentPage="Factory Dashboard " />
        {/*  */}
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Trade History</h2>
          </div>
        </div>
        <div className="parent-gap">
          <div className=" graph-container p-2">
            <div className="d-flex justify-content-between align-items-center w-100 px-1 ">
              <h6 className="title-graph">Total customers</h6>
              <i className="fa-solid fa-ellipsis graph-setting cursor"></i>
            </div>
            <Line
              className="line-Graph"
              data={{
                // name
                // el x axis names values of x -axis
                labels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
                datasets: [
                  {
                    // label: "Total customers",
                    //   values
                    // points on the graph
                    data: [1, 4, 10, 11, 34, 42, 45, 2, 10, 12],
                    backgroundColor: "green",
                    borderColor: "green",
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDashOffset: 0,
                    borderCapStyle: "rounded",
                    // tension:0,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  colors: {
                    enabled: false,
                  },
                  //  legend and scales to hide the
                  legend: {
                    display: false, // This will hide the legend
                  },
                },
              }}
            />

            <div className="d-flex justify-content-start align-items-center w-100 parent-persantage  px-1">
              <h6 className="title-graph m-0 p-0">2,420</h6>
              <div className="d-flex justify-content-between align-items-center perg-div">
                <i class="fa-solid fa-arrow-up arrow-icon text-success"></i>
                <p className="perg-text">40% vs last Month</p>
              </div>
            </div>
          </div>

          {/* container 2*/}

          <div className=" graph-container p-2">
            <div className="d-flex justify-content-between align-items-center w-100 px-1 ">
              <h6 className="title-graph">Total customers</h6>
              <i className="fa-solid fa-ellipsis graph-setting cursor"></i>
            </div>
            <Line
              className="line-Graph"
              data={{
                // name
                // el x axis names values of x -axis
                labels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
                datasets: [
                  {
                    // label: "Total customers",
                    //   values
                    // points on the graph
                    data: [10, 41, 15, 13, 345, 46, 47, 8, 10, 120],
                    backgroundColor: "red",
                    borderColor: "red",
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDashOffset: 0,
                    borderCapStyle: "rounded",
                    // tension:0,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  colors: {
                    enabled: false,
                  },
                  //  legend and scales to hide the
                  legend: {
                    display: false, // This will hide the legend
                  },
                },
                // scalesused to hide the x lines
                scales: {
                  // x:{
                  //   display:false , // This will hide the x-axis labels
                  // }
                },
              }}
            />

            <div className="d-flex justify-content-start align-items-center w-100 parent-persantage px-1">
              <h6 className="title-graph m-0 p-0">2,420</h6>
              <div className="d-flex justify-content-between align-items-center perg-div">
                <i class="fa-solid fa-arrow-down text-danger arrow-icon"></i>
                <p className="perg-text">40% vs last Month</p>
              </div>
            </div>
          </div>

          {/* container 3*/}

          <div className=" graph-container p-2">
            <div className="d-flex justify-content-between align-items-center w-100 px-1 ">
              <h6 className="title-graph">Total customers</h6>
              <i className="fa-solid fa-ellipsis graph-setting cursor"></i>
            </div>
            <Line
              className="line-Graph"
              data={{
                // name
                // el x axis names values of x -axis
                labels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
                datasets: [
                  {
                    // label: "Total customers",
                    //   values
                    // points on the graph
                    data: [1, 4, 10, 11, 34, 42, 45, 2, 10, 12],
                    backgroundColor: "green",
                    borderColor: "green",
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDashOffset: 0,
                    borderCapStyle: "rounded",
                    // tension:0,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  colors: {
                    enabled: false,
                  },
                  //  legend and scales to hide the
                  legend: {
                    display: false, // This will hide the legend
                  },
                },
                // scalesused to hide the x lines
                scales: {
                  // x:{
                  //   display:false , // This will hide the x-axis labels
                  // }
                },
              }}
            />

            <div className="d-flex justify-content-start align-items-center w-100 parent-persantage px-1">
              <h6 className="title-graph m-0 p-0">2,420</h6>
              <div className="d-flex justify-content-between align-items-center perg-div">
                <i className="fa-solid fa-arrow-up text-success"></i>
                <p className="perg-text">40% vs last Month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-btn-gap ">
          <div className="d-flex justify-content-between align-items-center">
            <p className="btns-text-dash">sales Report</p>
            <button className="btn-container-dash">
              <p>View Report</p>
            </button>
          </div>

          <div className="search-by-month-containr">
            <p className="month-btn active">12 months</p>
            <p className="month-btn">3 months</p>
            <p className="month-btn">30 days</p>
            <p className="month-btn">7 days</p>
            <p className="month-btn">24 hours</p>
          </div>
        </div>

        <div className="sales-graph-contaier">
          <Line options={options} data={data} className="line-sales-canvas" />
        </div>

        {/* search filter section */}
        <div className=" search-container d-flex justify-content-between align-items-center p-3 bg-white">
          <p className="btns-text-dash">sales Report</p>

          <div className=" btn-container d-flex justify-content-between align-items-center">
            <input
              type="datetime-local"
              className="from-control datetime-local"
              //   value={"2024-01-18T18:01"}
              // defaultValue={formattedDate}
            />

            <button className=" dropdown-toggle d-flex justify-content-center align-items-center">
              <i className="fa-solid fa-filter"></i>
              <p>Filter</p>
            </button>
          </div>
        </div>

        {/* data section */}

        <div className=" data-container-no-border w-100 p-3">
          <table className="table mb-0">
            {/* headers */}

            <thead>
              <tr className="row">
                <th className=" col-3">
                  <div className=" th-1st-title-gap d-flex justify-content-start align-items-center">
                    Transaction
                  </div>
                </th>

                <th className=" col-2"> Amount</th>

                <th scope="col" className=" col-2">
                  Date <i className="fa-solid fa-arrow-down"></i>
                </th>

                <th scope="col" className=" col-2">
                  Category
                </th>

                <th scope="col" className=" col-2">
                  Amount
                </th>

                <th scope="col" className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              <tr className="row">
                {/* col-1 */}
                <th className=" col-3">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="profile-img">
                      <img className="w-100 h-100" src={profile} />
                    </div>
                    <div>
                      <p className="transaction-text">Olivia Phye</p>
                    </div>
                  </div>
                </th>

                <th className=" col-2 d-flex align-items-center">
                  <p className="trate-sub-title">$30,021.23</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <p className="trate-sub-title">jan 13, 2022</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="status-continaer py-1 px-2">
                    <i className="fa-solid fa-circle"></i>
                    <p>Processing</p>
                  </div>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="payemnt-img">
                      <img className="w-100 h-100" src={payemtIcon} />
                    </div>
                    <div>
                      <p className=" name-text">Olivia Phye</p>
                      <p className=" email-text">OliviaPhye@gmail.com</p>
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className=" col-1 d-flex align-items-center justify-content-center"
                >
                  <svg
                    className="cursor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M2.39662 15.0964C2.43491 14.7518 2.45405 14.5795 2.50618 14.4185C2.55243 14.2756 2.61778 14.1396 2.70045 14.0142C2.79363 13.8729 2.91621 13.7504 3.16136 13.5052L14.1666 2.49999C15.0871 1.57951 16.5795 1.57951 17.4999 2.49999C18.4204 3.42046 18.4204 4.91285 17.4999 5.83332L6.49469 16.8386C6.24954 17.0837 6.12696 17.2063 5.98566 17.2995C5.86029 17.3821 5.72433 17.4475 5.58146 17.4937C5.42042 17.5459 5.24813 17.565 4.90356 17.6033L2.08325 17.9167L2.39662 15.0964Z"
                      stroke="#475467"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </th>
              </tr>

              {/* row2 */}
              <tr className="row">
                {/* col-1 */}
                <th className=" col-3">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="profile-img">
                      <img className="w-100 h-100" src={profile} />
                    </div>
                    <div>
                      <p className="transaction-text">Olivia Phye</p>
                    </div>
                  </div>
                </th>

                <th className=" col-2 d-flex align-items-center">
                  <p className="trate-sub-title">$30,021.23</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <p className="trate-sub-title">jan 13, 2022</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="status-continaer py-1 px-2">
                    <i className="fa-solid fa-circle"></i>
                    <p>Processing</p>
                  </div>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="payemnt-img">
                      <img className="w-100 h-100" src={payemtIcon} />
                    </div>
                    <div>
                      <p className=" name-text">Olivia Phye</p>
                      <p className=" email-text">OliviaPhye@gmail.com</p>
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className=" col-1 d-flex align-items-center justify-content-center"
                >
                  <svg
                    className="cursor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M2.39662 15.0964C2.43491 14.7518 2.45405 14.5795 2.50618 14.4185C2.55243 14.2756 2.61778 14.1396 2.70045 14.0142C2.79363 13.8729 2.91621 13.7504 3.16136 13.5052L14.1666 2.49999C15.0871 1.57951 16.5795 1.57951 17.4999 2.49999C18.4204 3.42046 18.4204 4.91285 17.4999 5.83332L6.49469 16.8386C6.24954 17.0837 6.12696 17.2063 5.98566 17.2995C5.86029 17.3821 5.72433 17.4475 5.58146 17.4937C5.42042 17.5459 5.24813 17.565 4.90356 17.6033L2.08325 17.9167L2.39662 15.0964Z"
                      stroke="#475467"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </th>
              </tr>

              {/* row3 */}
              <tr className="row">
                {/* col-1 */}
                <th className=" col-3">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="profile-img">
                      <img className="w-100 h-100" src={profile} />
                    </div>
                    <div>
                      <p className="transaction-text">Olivia Phye</p>
                    </div>
                  </div>
                </th>

                <th className=" col-2 d-flex align-items-center">
                  <p className="trate-sub-title">$30,021.23</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <p className="trate-sub-title">jan 13, 2022</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="status-continaer py-1 px-2">
                    <i className="fa-solid fa-circle"></i>
                    <p>Processing</p>
                  </div>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="payemnt-img">
                      <img className="w-100 h-100" src={payemtIcon} />
                    </div>
                    <div>
                      <p className=" name-text">Olivia Phye</p>
                      <p className=" email-text">OliviaPhye@gmail.com</p>
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className=" col-1 d-flex align-items-center justify-content-center"
                >
                  <svg
                    className="cursor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M2.39662 15.0964C2.43491 14.7518 2.45405 14.5795 2.50618 14.4185C2.55243 14.2756 2.61778 14.1396 2.70045 14.0142C2.79363 13.8729 2.91621 13.7504 3.16136 13.5052L14.1666 2.49999C15.0871 1.57951 16.5795 1.57951 17.4999 2.49999C18.4204 3.42046 18.4204 4.91285 17.4999 5.83332L6.49469 16.8386C6.24954 17.0837 6.12696 17.2063 5.98566 17.2995C5.86029 17.3821 5.72433 17.4475 5.58146 17.4937C5.42042 17.5459 5.24813 17.565 4.90356 17.6033L2.08325 17.9167L2.39662 15.0964Z"
                      stroke="#475467"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </th>
              </tr>

              {/* row3 */}
              <tr className="row">
                {/* col-1 */}
                <th className=" col-3">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="profile-img">
                      <img className="w-100 h-100" src={profile} />
                    </div>
                    <div>
                      <p className="transaction-text">Olivia Phye</p>
                    </div>
                  </div>
                </th>

                <th className=" col-2 d-flex align-items-center">
                  <p className="trate-sub-title">$30,021.23</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <p className="trate-sub-title">jan 13, 2022</p>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="status-continaer py-1 px-2">
                    <i className="fa-solid fa-circle"></i>
                    <p>Processing</p>
                  </div>
                </th>

                <th className=" col-2  d-flex align-items-center">
                  <div className="profile-container justify-content-start align-items-center d-flex">
                    <div className="payemnt-img">
                      <img className="w-100 h-100" src={payemtIcon} />
                    </div>
                    <div>
                      <p className=" name-text">Olivia Phye</p>
                      <p className=" email-text">OliviaPhye@gmail.com</p>
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className=" col-1 d-flex align-items-center justify-content-center"
                >
                  <svg
                    className="cursor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M2.39662 15.0964C2.43491 14.7518 2.45405 14.5795 2.50618 14.4185C2.55243 14.2756 2.61778 14.1396 2.70045 14.0142C2.79363 13.8729 2.91621 13.7504 3.16136 13.5052L14.1666 2.49999C15.0871 1.57951 16.5795 1.57951 17.4999 2.49999C18.4204 3.42046 18.4204 4.91285 17.4999 5.83332L6.49469 16.8386C6.24954 17.0837 6.12696 17.2063 5.98566 17.2995C5.86029 17.3821 5.72433 17.4475 5.58146 17.4937C5.42042 17.5459 5.24813 17.565 4.90356 17.6033L2.08325 17.9167L2.39662 15.0964Z"
                      stroke="#475467"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </th>
              </tr>

              <tr className="row">
                <div className="col-12  ReactPaginate">
                  <ReactPaginate
                    previousLabel={
                      <p>
                        <i className="fa-solid fa-arrow-left pe-2 text-dark "></i>
                        previous
                      </p>
                    }
                    nextLabel={
                      <p>
                        next
                        <i className="fa-solid fa-arrow-right ps-2 text-dark "></i>
                      </p>
                    }
                    pageCount={10} // total number to pages
                    forcePage={0}
                    onPageChange={10}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    containerClassName="pagination align-items-center justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    activeClassName="active"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    previousClassName="page-item-prev  me-3"
                    previousLinkClassName="page-link text-dark margin-prev"
                    nextClassName="page-item-next ms-3"
                    nextLinkClassName="page-link text-dark margin-next"
                    navClassName="pagination-custom"
                  />
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
