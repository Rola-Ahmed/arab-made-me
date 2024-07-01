import Carousel from "react-grid-carousel";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";

export default function Team(props) {
  let { handleShow, Button, factoryProfile, toast, isLogin, deleteTeam } =
    props;

  const deleteData = async (itemId, indexArr) => {
    try {
      let config = {
        method: "delete",
        url: `${baseUrl}/teams/${itemId}`,

        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      deleteTeam(indexArr);
      toast("Data Deleted Successfully", {
        position: "top-center",
        autoClose: 5000,
        // hideProgressBar: false,
        closeOnClick: true,
        //pauseOnHover: true,
        draggable: true,
        // progress: undefined,
        theme: "colored",
        type: "success",
      });

     
    } catch (error) {
      // setapiLoadingData(true);

      toast("Something went wrong, please try again later", {
        position: "top-center",
        autoClose: 5000,
        // hideProgressBar: false,
        closeOnClick: true,
        //pauseOnHover: true,
        draggable: true,
        // progress: undefined,
        theme: "colored",
        type: "error",
      });
    }
    // }
  };
  
  return (
    <>
      {" "}
      <div id="team"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          {" "}
          <p>Team</p>
          <div className="h-100  " style={{ width: "74vw" }}>
            {" "}
            {/* ----------------------- */}
            <div className="row  ">
              <div className="col-12">
                {factoryProfile?.teamMembers?.length > 0 ? (
                  <Carousel
                    cols={4}
                    rows={1}
                    // gap={10}
                    scrollSnap={true}
                    loop
                    showDots
                    hideArrow={false}
                  >
                    {factoryProfile?.teamMembers?.map((item, index) => (
                      <Carousel.Item>
                        {/* <div className="col-3 " key={index}> */}
                        <div className="parent-team w-100">
                          <i
                            class="fa-solid fa-trash-can d-flex justify-content-end cursor"
                            onClick={() => {
                              deleteData(item?.id, index);
                            }}
                          ></i>
                          <div className=" member-cont  d-grid justify-content-center  ">
                            <div className="w-100 justify-content-center d-flex ">
                              <img
                                className="team-img"
                                alt="team img"
                                src={`${baseUrl_IMG}/${item?.image}`}
                                onError={handleImageError}
                              />
                            </div>
                            <div>
                              <p className="w-100 text-center team-name fw-bolder">
                                {item.name}
                              </p>
                              <p className="w-100 text-center team-name">
                                {item.role}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* </div> */}
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
                  onClick={() => handleShow("newTeamReadOnly")}
                >
                  <p className="cursor">Add New Team </p>
                </Button>
              </div>
            </div>
            {/* </form> */}
            {/* ----------------------- */}
          </div>
        </div>
      </div>
    </>
  );
}
