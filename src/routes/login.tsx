
import React, { useState} from "react";
import {Form, Link, useNavigate} from "react-router-dom";
import {FirebaseError} from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase.tsx";
import {Error, Input, Switcher, Title, Wrapper} from "../components/auth-components.tsx";
import GithubButton from "../components/github-btn.tsx";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name,value}} = e;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isLoading || email === "" || password === "") return;

        try {
            setLoading(true);
            //Login
            await signInWithEmailAndPassword(auth, email, password);
            //redirect to the home page
            navigate("/");
        } catch (e) {
            if(e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return <Wrapper>
        <Title>Login 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input name="email" onChange={onChange} value={email} placeholder="Email" required/>
            <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password"/>
            <Input type="submit" value={isLoading ? "Loading...":"Login"}/>
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
            Don't have an account? {" "}
            <Link to="/create-account">Create one &rarr;</Link>
        </Switcher>
        <GithubButton/>
    </Wrapper>;

}