export default function FormVlaidtionError(props) {
  let { formValidation, vlaidationName } = props;

  let { errors, touched } = formValidation;
  return (
    <>
      {errors[vlaidationName] && touched[vlaidationName] && (
        <small className="form-text text-danger">
          {errors[vlaidationName]}
        </small>
      )}
    </>
  );
}
