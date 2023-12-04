import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";

const router = createBrowserRouter([
  {
    path:"/"
    , element: <Layout/>
    , children: [
      {
        path: ""
        , element: <Home/>
      },
      {
        path: "profile"
        , element: <Profile/>
      }
    ]
  },
  {
    path: "/login"
    , element: <Login/>
  },
  {
    path: "/create-account"
    , element: <CreateAccount/>
  }
]);

const GlobalStypes=createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: whitesmoke;
  }
`
function App() {
  return (
    <>
      <GlobalStypes/>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
