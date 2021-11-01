import axios from "axios";
import { cusAlert } from "./customAlert";

export const updatePassword = async ({
  oldPassword,
  password,
  passwordConfirm,
}) => {
  try {
    const res = await axios({
      url: "/api/v1/users/me/password",
      method: "PATCH",
      data: { oldPassword, password, passwordConfirm },
    });

    if (res.status == 200) {
      cusAlert(true, "password updated");
    }
  } catch (error) {
    cusAlert(false, "There was an error");
  }
};

export const updateUser = async (data) => {
  try {
    const res = await axios({
      url: "/api/v1/users/me",
      method: "PATCH",
      data,
    });

    if (res.status == 200) {
      cusAlert(true, "user info updated");
    }
  } catch (error) {
    cusAlert(false, "There was an error");
  }
};
