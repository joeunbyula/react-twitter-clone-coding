import {
    collection,
    /*  getDocs, */
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {db} from "../firebase.tsx";
import { getDocs } from "firebase/firestore";
import Tweet from "./tweet.tsx";

export interface ITweet {
    tweet:string;
    userId:string;
    username:string;
    createdAt:number;
    photo:string;
    id:string;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db,"tweets"),
            orderBy("createdAt")
        );
        const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map(doc=> {
          const {tweet, userId, username, createdAt, photo} = doc.data();
          return {
              tweet
              , userId
              , username
              , createdAt
              , photo
              , id:doc.id
          };
        });
        setTweets(tweets);
    }
    useEffect(() => {
        fetchTweets();
    }, []);
    return <Wrapper>
        {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
        ))}
    </Wrapper>
}