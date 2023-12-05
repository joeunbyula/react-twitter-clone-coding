import PostTweetForm from "../components/post-tweet-form.tsx";
import styled from "styled-components";

const Wrapper = styled.div`

`;
export default function Home() {
    return (
        <Wrapper>
            <PostTweetForm/>
        </Wrapper>
    );
}