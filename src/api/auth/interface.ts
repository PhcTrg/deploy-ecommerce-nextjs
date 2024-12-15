interface IReqLogin {
  username: string;
  password: string;
}

interface IResLogin {
  token: string;
}

interface IResGetUser {
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  email: string;
  role: string;
}

interface IReqUpdateUser {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  email: string;
  role: string;
}

interface IReqForgotPassword {
  email: string;
}

interface IResForgotPassword {
  message: string;
}

interface IReqResetPassword {
  email: string;
  otp: string;
  newPassword: string;
}

interface IResResetPassword {
  message: string;
}
