import "./footer.css";
import { Link } from "react-router-dom";
import { Whitelogo } from "constants/Images";
function Footer(props) {
  return (
    <footer class="text-center text-lg-start bg-body-tertiary text-muted bg-main pt-4 ">
      <section class="">
        <div class="container text-center text-md-start mt-5">
          <div class="row mt-3">
            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <Link className=" cursor" to="/">
                <img src={Whitelogo} alt="logo" className="fotter-logo" />
              </Link>
              <p className="my-4 text-white ">
                Arab Made is a B2B platform for Private Label services, offering
                powerful, self-serve product and growth analytics to help launch
                your product and retain more buyers. They also provide a Product
                Search Market Place and Factory Gallery.
              </p>
              <section class="d-grid gap-2">
                <h6 className="text-uppercase fw-bold  text-main ">
                  Get intouch:
                </h6>
                <div class="d-flex justify-content-between flex-warp">
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-facebook-f"></i>
                  </Link>
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-twitter"></i>
                  </Link>
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-google"></i>
                  </Link>
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-instagram"></i>
                  </Link>
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-linkedin"></i>
                  </Link>
                  <Link href="" class=" text-reset">
                    <i class="fab fs-4 text-white fa-github"></i>
                  </Link>
                </div>
              </section>
            </div>

            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4 text-main">Sectors</h6>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2">
                  Electronics
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2">
                  Chemicals
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2">
                  Medicals
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2">
                  Pharmaceutical
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2">
                  view all
                </Link>
              </p>
            </div>

            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 ">
              <h6 class="text-uppercase fw-bold mb-4 text-main">
                Useful links
              </h6>
              <p>
                <Link href="#!" class="nav-link text-start mb-2">
                  Sourcing Hub
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start  mb-2 ">
                  Factiry Gallery
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start mb-2 ">
                  Products
                </Link>
              </p>
              <p>
                <Link href="#!" class="nav-link text-start ">
                  Contact us
                </Link>
              </p>
            </div>

            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 class="text-uppercase fw-bold mb-4 text-main">Contact</h6>
              <p className="text-white mb-2">
                <i class="fas text-white fa-home me-3"></i> Egypt Cairo
              </p>
              <p className="text-white mb-2">
                <i class="fas text-white fa-envelope me-3"></i>
                arabmade@support.com
              </p>
              <p className="text-white mb-2">
                <i class="fas text-white fa-phone me-3"></i> + 01 234 567 88
              </p>
              <p className="text-white ">
                <i class="fas text-white fa-print me-3"></i> + 01 234 567 89
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="text-center pb-4">
        © 2021 Copyright:
        <Link class="text-reset fw-bold" href="https://mdbootstrap.com/">
          MDBootstrap.com
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
