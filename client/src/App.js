import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import AuthService from "./services/auth.service";
import CourseComponent from "./components/course-component";
import PostCourseComponent from "./components/postCourse-component";
import EnrollComponent from "./components/enroll-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ),
      children: [
        {
          index: "/",
          element: <HomeComponent />,
        },
        {
          path: "register",
          element: <RegisterComponent />,
        },
        {
          path: "login",
          element: (
            <LoginComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
        },
        {
          path: "profile",
          element: (
            <ProfileComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
        },
        {
          path: "course",
          element: (
            <CourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
        },
        {
          path: "postCourse",
          element: (
            <PostCourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
        },
        {
          path: "enroll",
          element: (
            <EnrollComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
