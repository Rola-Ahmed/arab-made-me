*****************************************************************************************

# Dashboards

## 1. HeaderSection Component
- **Usage**:  
   - shows the title of the page & action bts(download csv) & prv pages
   - This component is used in each view list of requests component.
- **Displayed**:  in  Index component for each Request    
- **Responsibilities**:
  - **Column Name Creation**: Handles the creation of column names for the CSV.
  - **Data Filtering**: Filters out unnecessary data when generating the CSV.
  - **Data Conversion**: Converts the data from an object format to rows and columns suitable for CSV.
- **Includes**: 
   - Contains a Notification component to manage alerts and messages.
   - PageUtility the roll back page


## 2. SearchFilterSection Component
- **Usage**: This component is responsible for handling search and sort filters.

- **State Management**:
  - **Filter State**: Manages filter state with two filters: search filter (`formsFilter`) and sort filter (`sort`).

- **Functions**:
  - **filtterData**: Updates the filter state and passes the updated filter data to the parent component using the `setFilterData` function.

- **Effects**:
  - **Initial Load**: On initial load, sets the default filter data.

- **Structure**:
  - **Search Bar**: Provides an input field for searching by product name.
  - **Sort Dropdown**: Provides options to sort the data by various criteria (e.g., Date, Price
  ).
# It focuses on handling search and filter functionalities based on the provided props (setFilterData) and local state (filter).   
    

## 3. DataStatus Component
- **Usage**: 
  - This component is used to indicate the status of data, including loading, errors, or empty data.
   - It provides visual feedback to users about the status of the requested data, enhancing user experience and usability.

- **Props**:
  - **requestedData**: Array containing the requested data.
  - **errorsMsg**: Message to display in case of errors.
  - **apiLoadingData**: Boolean indicating whether data is still loading.

- **Functionality**:
  - Displays a message or spinner based on the provided data status.
  - If `requestedData` is empty, it displays a message indicating no records or shows a spinner if data is still loading.
  - If `errorsMsg` is provided, it displays the error message.

- **Displayed**:  In  Index component for each Request    


<!-------------------------------------------- hooks ------------------------------------------------>
## 4 useAuthFormChecks
  - **Usage**: 
    - used to check if user can access (for importers) this page & and if data is loaded succesfuly from api
   
  - **Props**:
    - **isLoading**:  An object that indicates whether data is being loaded from the API.
    - **headerTitle**: The title of the form header.
    - **pagePath**:  The path to redirect the user to if they need to sign in first.


  - **Functionality**:
    -  This hook determines if the current user(Importer Only) is allowed to access external forms (e.g., White Label, Private Label, Custom Product Request).

    - **Login Check**: Verifies if the user is logged in.
      - If not logged in, a sign-in message is displayed, prompting the user to sign in. After signing in, they will be redirected to the form page.
      
    - **User Type Check**: Checks if the current user is an importer.
      - If the user is not an importer, a message is displayed, and the form is not shown.
      - If the user is an importer, the form page is displayed.
      
    - **Loading Check**: Verifies if the data has been successfully loaded from the API.
      - If `isLoading.pageLoading` is true, it indicates that data is still being loaded.
      - If `isLoading.pageLoading` is false, it means the data has been successfully loaded.

    This hook streamlines the process of user validation and data loading checks, ensuring that users have the appropriate permissions and that necessary data is available before displaying the form.







