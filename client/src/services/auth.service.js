import axios from "axios";
const API_URL = "http://localhost:8080/api/user";
const BASE_URL = process.env.REACT_APP_API_BASE_URL + "api/user";

class AuthService {
  login(email, password) {
    return axios.post(BASE_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    return axios.post(BASE_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
