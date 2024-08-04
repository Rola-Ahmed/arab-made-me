import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
export default function FactoryTeam({
  teamMembers,
  handleImageError,
  baseUrl_IMG,
}) {
  return (
    <>
      <h3 className="text-fac-4">Our People</h3>

      <div className="row  mx-2 mx-md-0">
        <div className="col-12">
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
          >
            {teamMembers?.map((item, index) => (
              <SwiperSlide>
                <div className="parent-team w-100">
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
                      <p className="w-100 text-center team-name">{item.role}</p>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
