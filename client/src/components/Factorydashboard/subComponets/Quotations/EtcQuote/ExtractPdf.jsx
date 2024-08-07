import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer, Image } from '@react-pdf/renderer';
import { logo } from 'constants/Images';

// Define styles
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 10,
    // marginBottom:'5'
    // padding: 10,
    // flexGrow: 1,
  },
  footer: {


    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 12,
    marginTop:'5vh',
    marginBottom:'2vh',
    marginLeft:'2vh',
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
  },
  logo: {
    width: '20vw',
    textAlign: 'left',
    // marginLeft: '3px',
    marginBottom: 5,
  },
  textImg: {
    textAlign: 'left',
    marginLeft: '6px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    width: '100%',
    marginTop:'20px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
  },
  cellFixed: {
    width: '30%', // Fixed width for the first column
    display:'table-cell',
    borderRight: '1px solid #ddd',
    padding: 8,
    textAlign: 'left',
    fontSize: 12,
    fontWeight:'bolder'
  },
  cellFlexible: {
    flex: 1, // Flexible width for the second column
    borderRight: '1px solid #ddd',
    padding: 8,
    textAlign: 'left',
    fontSize: 12,
    fontWeight:100

  },

  cellWithBg: {
    backgroundColor: 'rgba(126, 184, 204, 0.203)', // Use backgroundColor here
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
  },
});

const MyDocument = ({ requestedData }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap> 
      <View style={styles.section}>
        <Text style={{ textAlign: 'center', fontWeight: 'bolder' }}>
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
            <Text style={styles.defultText}>{requestedData?.importer?.repName}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Buyer Email</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.importer?.repEmail}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Buyer phone number</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.importer?.repPhone}</Text>
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
            <Text style={styles.defultText}>{requestedData?.factory?.name}</Text>
          </View>
        </View>

        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text> Factory Representative Name</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.factory?.repName}</Text>
          </View>
        </View>

        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text> Factory Representative Email</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.factory?.repEmail}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Factory Representative Number</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.factory?.repPhone}</Text>
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
            <Text style={styles.defultText}>{requestedData?.formCode}</Text>
          </View>
        </View>

        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Qoute Date</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.createdAt?.split("T")?.[0]}</Text>
          </View>
        </View>

        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Qoute Expiry</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.deadline?.split("T")?.[0]}</Text>
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
            <Text style={styles.defultText}>{requestedData?.productName}</Text>
          </View>
        </View>

        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Total Quantity</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.factory?.minQuantity}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Product Characteristics</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.factory?.minQuantity}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Other Information</Text>
          </View>
          <View style={styles.cellFlexible}>
            <Text style={styles.defultText}>{requestedData?.otherInfoRequest}</Text>
          </View>
        </View>
       
      </View>   


{/* delivery date */}
      <View style={styles.table}>
        {/* Table Header */}
        
        
        <View style={styles.row}>
          <View style={[styles.cellFixed, styles.cellWithBg]}>
            <Text>Delivery  timeline</Text>
          </View>
          <View style={[styles.cellFlexible,styles.cellWithBg]}>
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
            <Text style={styles.defultText}>12</Text>
          </View>
          
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.minQuantity}</Text>
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
            <Text style={styles.defultText}>12</Text>
          </View>
          
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.minQuantity}</Text>
          </View>
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.discounts} </Text>
          </View>
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>total Price</Text>
          </View>
        </View>

        
       

       
        
       
       
      </View>  
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
            <Text style={styles.defultText}>12</Text>
          </View>
          
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.minQuantity}</Text>
          </View>
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.discounts} </Text>
          </View>
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>total Price</Text>
          </View>
        </View>

        
       

       
        
       
       
      </View>  
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
            <Text style={styles.defultText}>12</Text>
          </View>
          
          <View style={[styles.cellFlexible]}>
            <Text style={styles.defultText}>{requestedData?.minQuantity}</Text>
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



      <View  style={{height:'5vh'}} fixed>
      <Text style={{color:'white'}}>https://ara-made.com</Text>
      </View>  


      <View  style={styles.footer} fixed>
        <Image  fixed src={logo} style={styles.logo} />
        <Text style={styles.textImg}>https://ara-made.com</Text>
        <Text style={{ fontSize:'10px' , textAlign:'center' }} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )}  />
      </View >
     
    </Page>
    
  </Document>
);

const ExtractPdf = ({ requestedData }) => (
  <div>
    {/* Display PDF on the screen */}
    <PDFViewer width="100%" height="800px">
      <MyDocument requestedData={requestedData} />
    </PDFViewer>

    {/* Provide a download link */}
    <div>
      <PDFDownloadLink document={<MyDocument requestedData={requestedData} />} fileName="quote.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  </div>
);

export default ExtractPdf;
