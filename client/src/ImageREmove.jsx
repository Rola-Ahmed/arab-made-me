import React from "react";
import { useFormik } from "formik";

const FriendList = () => {
  const formik = useFormik({
    initialValues: {
      friends: [{ name: "orla", age: "200" }],
    },
    onSubmit: (values) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
      }, 500);
    },
  });
  console.log("formikformik",formik)

  return (
    <div>
      <h1>Friend List</h1>
      <form onSubmit={formik.handleSubmit}>
        {formik.values.friends && formik.values.friends.length > 0 ? (
          formik.values.friends.map((friend, index) => (
            <div key={index}>
              <input
                type="text"
                name={`friends.${index}.name`}
                value={formik.values.friends[index].name}
                onChange={formik.handleChange}
              />
              <button
                type="button"
                onClick={() => formik.values.friends.splice(index, 1)}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => formik.values.friends.splice(index + 1, 0, "")}
              >
                +
              </button>
            </div>
          ))
        ) : (
          <button type="button" onClick={() => formik.values.friends.push("")}>
            Add a friend
          </button>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default FriendList;
