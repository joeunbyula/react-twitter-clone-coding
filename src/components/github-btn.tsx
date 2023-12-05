import styled from "styled-components";
import {GithubAuthProvider, signInWithPopup } from "firebase/auth";
import {auth} from "../firebase.tsx";
import {useNavigate} from "react-router-dom";

const Button = styled.span`
    background-color: whitesmoke;
    font-weight: 500;
    width: 100%;
    color: black;
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap:5px;
    align-items: center;
    justify-content: center;
`;

const Logo = styled.image`
  height: 25px;
`;
export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider); //popup형식
            //await signInWithRedirect(auth, provider); //github이동 로그인
            navigate("/");
        } catch (e) {
            console.error(e)
        }
    }
    return <Button onClick={onClick}><Logo src="/github-logo.svg">Continue with Github</Logo></Button>;
}