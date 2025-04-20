import { lazy } from "react";
import AuthLayout from "../Layout/AuthLayout";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const AddPost = lazy(() => import("../pages/Posts/AddPost"));
const AllPosts = lazy(() => import("../pages/Posts/AllPosts"));
const EditPost = lazy(() => import("../pages/Posts/EditPost"));
const Post = lazy(() => import("../pages/Posts/Post"));
const NotFound = lazy(() => import("../pages/Not-found"));

// Route wrappers
const PrivateRoute = ({ children }) => (
  <AuthLayout authentication={true}>{children}</AuthLayout>
);

const PublicRoute = ({ children }) => (
  <AuthLayout authentication={false}>{children}</AuthLayout>
);

// Define all routes
const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/my-posts",
    element: (
      <PrivateRoute>
        <AllPosts />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-post",
    element: (
      <PrivateRoute>
        <AddPost />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit-post/:id",
    element: (
      <PrivateRoute>
        <EditPost />
      </PrivateRoute>
    ),
  },
  {
    path: "/post/:id",
    element: <Post />,
  },
  {
    path: "*",
    element: <NotFound />, // Default 404 route
  },
];

export default routes;
