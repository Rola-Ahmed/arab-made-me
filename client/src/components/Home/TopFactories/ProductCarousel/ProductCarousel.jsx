import Carousel from "react-grid-carousel";
import ProductList from "./ProductList";

export default function ProductCarousel(props) {
  let { factoryitem } = props;

  return (
    <Carousel
      cols={5}
      rows={1}
      // gap={0}
      // scrollSnap={true}
      loop
      showDots
      autoPlay={5000}
      scrollSnap={true}
      stopOnHover={true}
      // dotColorActive={'yellow'}
      // dotColorInactive={'gray'}
      // showThumbs={true}
      // thumbWidth={20}
      interval={3000}
      arrowLeft={
        <div className="arrow-btn-2 arrowL position-absolute  ">
          <i className="fa-solid fa-chevron-left"></i>
        </div>
      }
      arrowRight={
        <div className="arrow-btn-2 arrowR position-absolute  ">
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      }
      responsiveLayout={[
        {
          breakpoint: 1398,
          cols: 5,
        },
        {
          breakpoint: 767,
          cols: 9,
          gap: 10,
        },

        {
          breakpoint: 539,
          cols: 7,
        },
        {
          breakpoint: 426,
          cols: 5,
          gap: 10,
        },
        {
          breakpoint: 376,
          cols: 4,
          gap: 10,
        },
      ]}
      mobileBreakpoint={300}
    >
      {factoryitem?.productData?.map((item, index) => (
        <Carousel.Item>
          <ProductList index={index} item={item} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
