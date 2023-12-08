
import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {getAuth, updateCurrentUser, updateProfile} from "firebase/auth";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import {auth, db, storage} from "../firebase.tsx";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
  margin-right: 5px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const NameInput = styled.input`
  border: 2px solid white;
  margin-right: 10px;
  margin-left: 30px;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 60%;
  cursor: pointer;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
`;

const NameDiv = styled.div`
  
  svg {
    width: 20px;
  }
`;


export default function Profile() {

    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [updateName, setUpdateName] = useState(user?.displayName);
    const [isEdit, setIsEdit] = useState(false);

    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if(!user) return;
        if(files && files.length === 1) {
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, files[0]);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl
            })
        }
    }
    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db,"tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
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

    const onIsEdit = async () => {
        setIsEdit(prevState => !prevState);
        if(!user) return;
       // console.log(e.target);
        if(isEdit) {
            await updateProfile(user, {
                displayName : updateName
            }).then(() => {
                //왜 현재 사용자가 refresh가 안될까....
                user.reload();
            });

        } else {
            setUpdateName(user?.displayName);
        }
    }

    const onChangeName = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUpdateName(e.target.value);
    }
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true">
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput
                onChange={onAvatarChange}
                id="avatar"
                type="file"
                accept="image/*"
            />
            <NameDiv>
                {isEdit ? <NameInput onChange={onChangeName} value={updateName}></NameInput> : <Name>{user?.displayName ?? "Anonymous"}</Name>}
                {user ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path  onClick={onIsEdit} fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                        </svg>
                    </> : null
                }
            </NameDiv>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}