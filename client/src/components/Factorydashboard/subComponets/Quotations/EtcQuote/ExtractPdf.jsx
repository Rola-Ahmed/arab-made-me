import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { logo } from "constants/Images";

// Define styles
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: "5vh",
    marginBottom: "2vh",
    marginLeft: "2vh",
  },

  logo: {
    width: "20vw",
    textAlign: "left",
    marginBottom: 5,
  },
  textImg: {
    textAlign: "left",
    marginLeft: "6px",
    fontSize: "10px",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    width: "100%",
    marginTop: "20px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
  },
  cellFixed: {
    width: "30%", // Fixed width for the first column
    display: "table-cell",
    borderRight: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    fontSize: 10,
    fontWeight: "bolder",
  },
  cellFlexible: {
    flex: 1, // Flexible width for the second column
    borderRight: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    fontSize: 11,
    fontWeight: 100,
  },

  cellWithBg: {
    backgroundColor: "rgba(126, 184, 204, 0.203)", // Use backgroundColor here
  },

  // ----------------------------------------------------------------------------
  watermark: {
    position: "absolute",
    top: "50%",
    left: "25%",
    transform: "rotate(-30deg)",
    opacity: 0.2,
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 40,
    textAlign: "center",
    color: "gray",
  },
});

const MyDocument = ({ requestedData, qouteOn }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.section}>
          <Text style={{ textAlign: "center", fontWeight: "bolder" }}>
            Quotations Details on {requestedData?.title}
          </Text>
        </View>
        {/* Buyer data Rows */}
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Buyer Name</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.importer?.repName}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Buyer Email</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.importer?.repEmail}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Buyer phone number</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.importer?.repPhone}
              </Text>
            </View>
          </View>

          {/* Add more rows as needed */}
        </View>

        {/* table for factory details */}
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Factory Name</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.factory?.name}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text> Factory Representative Name</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.factory?.repName}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text> Factory Representative Email</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.factory?.repEmail}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Factory Representative Number</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.factory?.repPhone}
              </Text>
            </View>
          </View>

          {/* Add more rows as needed */}
        </View>

        {/* qoutation details */}
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Qoute No.</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>{requestedData?.id}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Qoute Date</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.createdAt?.split("T")?.[0]}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Qoute Expiry</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.deadline?.split("T")?.[0]}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Form Status</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>{requestedData?.status}</Text>
            </View>
          </View>

          {/* Add more rows as needed */}
        </View>

        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>product Name</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.productName}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Total Quantity</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.minQuantity}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Product Characteristics</Text>
            </View>
            <View style={styles.cellFlexible}>
              <View style={styles.cellFlexibleItem}>
                {/* {qouteOn?.specialCharacteristics && 
      Object.keys(qouteOn?.specialCharacteristics)?.length > 0 && 
      Object.entries(qouteOn?.specialCharacteristics).map(([key, value], index) => (
          <>
          {`${key}: ${value}`}
          </>
        
      ))} */}
                <Text style={styles.defultText}>
                  {qouteOn?.specialCharacteristics &&
                    Object.keys(qouteOn?.specialCharacteristics)?.length > 0 &&
                    Object.entries(qouteOn?.specialCharacteristics)?.map(
                      ([key, value]) => `${key}: ${value},  `
                    )}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Other Information</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.otherInfoRequest}
              </Text>
            </View>
          </View>
        </View>

        {/* delivery date */}
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>Delivery timeline</Text>
            </View>
            <View style={[styles.cellFlexible, styles.cellWithBg]}>
              <Text style={styles.defultText}>Quanitity</Text>
            </View>
          </View>

          {requestedData?.timeLine?.map((item, index) => (
            <View style={styles.row}>
              <View style={[styles.cellFixed]}>
                <Text>{item?.date?.split("T")?.[0]}</Text>
              </View>
              <View style={styles.cellFlexible}>
                <Text style={styles.defultText}>{item?.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* remove */}
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>shipping Conditions</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.shippingConditions}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>shipping Type and Size</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.shippingSize}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>supply Location</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.supplyLocation}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>packing Conditions</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.packingConditions}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>quality Conditions</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.qualityConditions}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>payment Terms</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>
                {requestedData?.paymentTerms}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>notes</Text>
            </View>
            <View style={styles.cellFlexible}>
              <Text style={styles.defultText}>{requestedData?.notes}</Text>
            </View>
          </View>
        </View>

        {/* ---------------------------- */}
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.row}>
            <View style={[styles.cellFixed, styles.cellWithBg]}>
              <Text>product Name</Text>
            </View>
            <View style={[styles.cellFlexible, styles.cellWithBg]}>
              <Text style={styles.defultText}>unit price</Text>
            </View>

            <View style={[styles.cellFlexible, styles.cellWithBg]}>
              <Text style={styles.defultText}>Quantity</Text>
            </View>
            <View style={[styles.cellFlexible, styles.cellWithBg]}>
              <Text style={styles.defultText}>Discount%</Text>
            </View>
            <View style={[styles.cellFlexible, styles.cellWithBg]}>
              <Text style={styles.defultText}>total Price</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cellFixed]}>
              <Text>product Name</Text>
            </View>
            <View style={[styles.cellFlexible]}>
              <Text style={styles.defultText}>{requestedData?.price}</Text>
            </View>

            <View style={[styles.cellFlexible]}>
              <Text style={styles.defultText}>
                {requestedData?.minQuantity}
              </Text>
            </View>
            <View style={[styles.cellFlexible]}>
              <Text style={styles.defultText}>{requestedData?.discounts} </Text>
            </View>
            <View style={[styles.cellFlexible]}>
              <Text style={styles.defultText}>total Price</Text>
            </View>
          </View>
        </View>

        {/* remove */}

        <View style={styles.watermark} fixed>
          <Text style={styles.watermarkText}>https://arab-made.com</Text>
        </View>

        <View style={{ height: "5vh", marginTop: "2vh" }} fixed>
          <Text style={{ color: "white" }}>https://arab-made.com</Text>
        </View>

        <View style={styles.footer} fixed>
          <Image fixed src={logo} style={styles.logo} />
          <Text style={styles.textImg}>https://arab-made.com</Text>
          <Text
            style={{ fontSize: "10px", textAlign: "center" }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

const ExtractPdf = ({ requestedData, qouteOn }) => (
  <div>
    {/* Display PDF on the screen */}
    {/* <PDFViewer width="100%" height="800px">
      <MyDocument requestedData={requestedData} qouteOn={qouteOn} />
    </PDFViewer> */}

    {/* Provide a download link */}
    <div>
      <PDFDownloadLink
        document={
          <MyDocument requestedData={requestedData} qouteOn={qouteOn} />
        }
        fileName="quote.pdf"
        className="fs-12"
      >
        {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  </div>
);

export default ExtractPdf;
