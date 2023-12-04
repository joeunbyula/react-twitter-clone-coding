import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loading-screen.tsx";
import {auth} from "./firebase.tsx";

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

const GlobalStyles=createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: whitesmoke;
    font-family: -apple-system, system-ui, BlinkmacSystemFont, 'Segoe UI', 
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
  }
`
function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    //wait for firebase
    //setTimeout(() => setIsLoading(false),5000);
    await auth.authStateReady();
    setLoading(false);
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles/>
      {isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>}
    </>
  )
}

export default App
