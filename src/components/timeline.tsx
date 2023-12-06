import {
    Unsubscribe,
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

    useEffect(() => {
        let unsubscirbe : Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt")
            );
            // const snapshot = await getDocs(tweetsQuery);
            // const tweets = snapshot.docs.map(doc=> {
            //   const {tweet, userId, username, createdAt, photo} = doc.data();
            //   return {
            //       tweet
            //       , userId
            //       , username
            //       , createdAt
            //       , photo
            //       , id:doc.id
            //   };
            // });
            unsubscirbe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map(doc => {
                    const {tweet, userId, username, createdAt, photo} = doc.data();
                    return {
                        tweet
                        , userId
                        , username
                        , createdAt
                        , photo
                        , id: doc.id
                    }
                });
                setTweets(tweets);
            });
        };
        fetchTweets();
        return () => {
            unsubscirbe && unsubscirbe();
        }
    }, []);
    return <Wrapper>
        {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
        ))}
    </Wrapper>
}