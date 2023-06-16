import { toast } from "react-hot-toast";

// Todo : Validate login page username
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

// Todo : Validate password on password page
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

// Todo : Validate on reset page
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match...!");
  }

  return errors;
}

// Todo : Validate register form
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

// Todo : Validate profile page
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// Todo : Validate username
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required...!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username...!");
  }
  return error;
}

// Todo : Validate username
function passwordVerify(error = {}, values) {
  /* eslint-disable no-useless-escape */
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error("Password Required...!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong Password...!");
  } else if (values.password.length < 4) {
    error.password = toast.error(
      "Password must be more than 4 characters long...!"
    );
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character...!");
  }
  return error;
}

// Todo : Validate email
function emailVerify(error = {}, values) {
  /* eslint-disable no-useless-escape */
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!emailPattern.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
