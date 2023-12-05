
import React, {useState} from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../firebase.tsx";
import {Form, Link, useNavigate} from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {Error, Input, Switcher, Title, Wrapper} from "../components/auth-components.tsx";
import GithubButton from "../components/github-btn.tsx";

const errors = {
    "auth/email-already-in-use" : "That email already exist."
}

const initialValue = {
    isLoading: false
    , name: ""
    , email: ""
    , password: ""
    , error: ""
}

export default function CreateAccount() {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState(initialValue);
    const {isLoading, name, error, password, email} = inputValues;	//비구조화 할당

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {value, name:inputName} = e.target;
        setInputValues({...inputValues, [inputName]:value});

    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(name, email, password);
        e.preventDefault();
        inputValues["error"] = "";
        if(isLoading || name === "" || email === "" || password === "") return;

        try {
            inputValues["isLoading"] = true;
            //create and account
            const credentials = await createUserWithEmailAndPassword(auth, email,password);
            console.log(credentials.user);
            //set the name of the profile
            await updateProfile(credentials.user, {
                displayName: name,
            })
            //redirect to the home page
            navigate("/");
        } catch (e) {
            if(e instanceof FirebaseError) {
                inputValues["error"] = e.message;
            }
        } finally {
            inputValues["isLoading"] = false;
        }
    }
    return <Wrapper>
        <Title>Join 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input name="name" onChange={onChange} value={name} placeholder="Name" type="text" required/>
            <Input name="email" onChange={onChange} value={email} placeholder="Email" required/>
            <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password"/>
            <Input type="submit" value={isLoading ? "Loading...":"Create account"}/>
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
            Already have have an account? {" "}
            <Link to="/login">login &rarr;</Link>
        </Switcher>
        <GithubButton/>
    </Wrapper>;

}