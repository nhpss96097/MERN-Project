import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";
const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/courses";

class CourseService {
  constructor(token) {
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    this.token = token;
  }

  /* ---------------------------------- 創建課程 ---------------------------------- */
  post(title, description, price) {
    return axios.post(
      BASE_URL,
      { title, description, price },
      {
        headers: {
          Authorization: this.token,
        },
      }
    );
  }

  /* ---------------------------- 使用學生 id，找到學生註冊的課程 --------------------------- */
  getEnrolledCourses(_id) {
    return axios.get(BASE_URL + "/student/" + _id, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  /* ----------------------- 用 instructor id，找到該講師所擁有的課程 ---------------------- */
  get(_id) {
    return axios.get(BASE_URL + "/instructor/" + _id, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  /* -------------------------------- 用課程名稱搜尋課程 ------------------------------- */
  getCourseByName(name) {
    return axios.get(BASE_URL + "/findByName/" + name, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  enroll(_id) {
    return axios.post(
      BASE_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: this.token,
        },
      }
    );
  }

  /* --------------------------------- 獲得所有課程 --------------------------------- */
  getAllCourse(_id) {
    return axios.get(BASE_URL + "/", {
      headers: {
        Authorization: this.token,
      },
    });
  }
}

export default new CourseService();
