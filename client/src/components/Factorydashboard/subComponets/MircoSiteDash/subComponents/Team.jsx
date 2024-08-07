import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import InputField from 'components/Forms/Shared/InputField'

export default function Team(props) {
  let { handleShow,deleteData, teamMembers,teamValidation,handleClose,isLoading ,show,errorMsg,setSelectedDocs,selectedDocs,setErrorMsg} =
    props;

  return (
    <>
      <div id="team"></div>
      <div className="container-profile-input w-100 d-none">
        <div className="title-contianer-input w-100">
          <p>Team</p>
          {/* <div className="h-100  " style={{ width: "74vw" }}> */}
            {/* ----------------------- */}
            <div className="row  w-100">
              <div className="col-12">
                {teamMembers?.length > 0 ? (
                  <Swiper
                  modules={[Navigation]}
                  navigation={true}
                  slidesPerView={1.3}
                  spaceBetween={10}
                  breakpoints={{
                    541: {
                      slidesPerView: 2,
                    },
                    995: {
                      slidesPerView: 3,
                    },
                    1212: {
                      slidesPerView: 4,
                    },
                  }}
                  className="swiper h-75"
                  >
                    {teamMembers?.map((item, index) => (
                      <SwiperSlide>
                        {/* <div className="col-3 " key={index}> */}
                        <div className="parent-team w-fit-conent">
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
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <h5 className="text-muted text-center py-3">Empty</h5>
                )}


                <Button
                  className="btn-edit w-fit-content mt-3 "
                  variant="primary"
                  onClick={() => handleShow("newTeamReadOnly")}
                >
                  <p className="cursor">Add New Team </p>
                </Button>
              </div>

              

             
            </div>
          {/* </div> */}
        </div>
      </div>















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
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) }
              <div className="w-100 ">
                <form
                  onSubmit={teamValidation.handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-6">
                      <InputField
                       formValidation={teamValidation}
                       vlaidationName='teamName'
                       isRequired={false}
                       title="Member Name"
                       />
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


                    <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="image"
                    mediaMaxLen="1"
                    meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    // title="Company Banners"
                  />

                   

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
    </>
  );
}
