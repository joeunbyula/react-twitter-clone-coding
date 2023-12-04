import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loading-screen.tsx";
import {auth} from "./firebase";
import ProtectedRoute from "./components/protected-route.tsx";

const router = createBrowserRouter([
  {
    path:"/"
    , element: <ProtectedRoute><Layout/></ProtectedRoute>
    , children: [
      {
        path: ""
        , element: <Home/>
      },
      {
        path: "profile"
        , element:  <Profile/>
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

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;
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
    <Wrapper>
      <GlobalStyles/>
      {isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>}
    </Wrapper>
  )
}

export default App
