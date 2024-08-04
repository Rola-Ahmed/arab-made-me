import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";

export default function HeaderSlider({
  baseUrl_IMG,
  handleVedioError,
  handleImageError,

  factoryDetails,
}) {
  let { coverVideo, images, country, city, name, coverImage } = factoryDetails;
//   console.log("factoryDetails", factoryDetails);
  return (
    <>
      <section className="fact-sec1 container margin-sm-screen">
        <Swiper pagination={{ clickable: true }} modules={[Pagination]}>
          <SwiperSlide>
            {coverVideo?.length > 0 ? (
              <video
                src={`${baseUrl_IMG}/${coverVideo}`}
                autoPlay
                muted
                loop
                // controls
                onError={handleVedioError}
                className="HeroSlider"
              ></video>
            ) : (
              <video
                src={"vid1"}
                autoPlay
                muted
                loop
                // controls
                onError={handleVedioError}
                className="HeroSlider"
              ></video>
            )}
          </SwiperSlide>

          {images?.map((item, index) => (
            <SwiperSlide>
              <img
                src={`${baseUrl_IMG}/${item}`}
                alt={`img ${index + 1}`}
                onError={handleImageError}
                className="HeroSlider img"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="fact-logo container margin-sm-screen">
        <div className="logo-text">
          <div className="factory-logo-container">
            <img
              src={`${baseUrl_IMG}/${coverImage}`}
              alt="Factory Logo"
              onError={handleImageError}
            />
          </div>
          <div>
            <h2 className="text-fac-1">{name}</h2>
            <p className="text-fac-2">
              {/* city, country */}
              {city && `${city},`}

              {country}
            </p>
            <p className="text-fac-3">
              {/* 50 Followers */}
              {factoryDetails?.totalProducts} Products
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
