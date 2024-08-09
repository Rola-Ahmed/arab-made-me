# Factory Dashboard Section

1 - dashboard Notifications


-- 1-  Fetch RFQ NOTIFCATION - PATH :client\src\containers\Factorydashboard\Notifcations\RFqNotification.jsx
CONTAINS THE LOGIC PART (Fetch API)

2- RfqNotificationList
D:\documents\arab-made-sourcing-tree\client\src\components\Factorydashboard\Notification\RfqNotificationList.jsx
contains the frontend (view part)

<!--  -->
<!-- update visit -->

https://legacy.reactjs.org/docs/typechecking-with-proptypes.html





// import img1 from "../../../assets/images/sectors/1.jpg";
// import img2 from "../../../assets/images/sectors/2.jpg";
// import img3 from "../../../assets/images/sectors/3.jpg";
// import img4 from "../../../assets/images/sectors/4.jpg";
// import img5 from "../../../assets/images/sectors/5.jpg";
// import img6 from "../../../assets/images/sectors/6.jpeg";
// import img7 from "../../../assets/images/sectors/7.jpg";
// import img8 from "../../../assets/images/sectors/8.jpg";
// import img9 from "../../../assets/images/sectors/9.jpg";
// import img10 from "../../../assets/images/sectors/10.jpg";





Avoiding XSS (Cross-Site Scripting)
Use React's built-in protection against XSS by default.
Avoid using dangerouslySetInnerHTML unless absolutely necessary and ensure that any HTML content is sanitized.
js
<!-- import DOMPurify from 'dompurify'; -->





Role-Based Access Control (RBAC)
Implement RBAC to ensure users can only access what they are authorized to.
js
Copy code
const userHasAccess = (userRoles, requiredRole) => userRoles.includes(requiredRole);

// Example usage
if (!userHasAccess(currentUser.roles, 'admin')) {
  console.error('Access denied');
}




# Run npm audit
npm audit

# Install OWASP Dependency-Check
npm install -g owasp-dependency-check







Secure APIs
Validate and sanitize data on the server-side.
Implement proper CORS (Cross-Origin Resource Sharing) policies.
Example of Implementing Secure Practices in a React Application
js
Copy code
import React, { useState } from 'react';
import validator from 'validator';
import DOMPurify from 'dompurify';

const SecureForm = () => {
  const [email, setEmail] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validator.isEmail(email)) {
      setErrorMsg('Invalid email address');
      return;
    }

    const sanitizedContent = DOMPurify.sanitize(htmlContent);

    // Perform secure API call with sanitized data
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, content: sanitizedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
        />
      </div>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default SecureForm;


# give example on this Role-Based Access Control (RBAC)
Implement RBAC to ensure users can only access what they are authorized to.





import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";



import FactoryUnVerifiedModal from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";


    <FactoryUnVerifiedModal
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        userType="Factory"
      />