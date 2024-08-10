import ProductList from "./ProductList";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export default function ProductCarousel(props) {
  let { factoryitem } = props;

  // sub images in factory card
  return (
    
    
    
    <Swiper
                  modules={[Navigation]}
                  navigation={true}
                  slidesPerView={4}
                  spaceBetween={4}
                  breakpoints={{
                    413: {
                      slidesPerView: 7,
                    },
                    770: {
                      slidesPerView: 7,
                    },
                    1090: {
                      slidesPerView: 6,
                    },
                  }}
                  className="swiper sub-product-slider  w-100      "
                  >
                    {factoryitem?.productData?.map((item, index) => (

         <SwiperSlide className="w-fit-content">
          <ProductList index={index} item={item} />
        </SwiperSlide>
        
      ))}
        </Swiper>
                    
                    





            
                    
   
  );
}
