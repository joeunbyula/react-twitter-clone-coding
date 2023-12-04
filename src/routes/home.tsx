import {auth} from "../firebase.tsx";

export default function Home() {
    const logOut = () => {
        auth.signOut();
    }
    return <h1><button onClick={logOut}>LogOut</button> </h1>
}