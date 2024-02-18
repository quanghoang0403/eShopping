import { CloseCircleIcon } from "../../../../assets/icons.constants";

function LoginError(props) {
  const { message } = props;
  return (
    <>
      {message && (
        <div className="error-message">
          <CloseCircleIcon />
          <span>{message}</span>
        </div>
      )}
    </>
  );
}

export default LoginError;
