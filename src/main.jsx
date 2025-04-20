import { StrictMode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { createRoot } from "react-dom/client";
import ScrollToTop from "./pages/ScrollToTop.jsx";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <App />
      </>
    ),
    children: routes,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Analytics />
      <SpeedInsights />
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>
);
