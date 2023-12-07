import { styled } from "styled-components";
import { ITweet } from "./timeline";
import {auth, db, storage} from "../firebase";
import {collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import React, {useState} from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const TextArea = styled.textarea`
  margin: 10px 0px;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Button = styled.button`
  &.editBtn, &.postBtn {
    background-color: powderblue;
  }
  margin-right: 10px;
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoUpload = styled.label`

  svg {
    width: 100px;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [isEdit, setIsEdit] = useState(false);
    const [updateTweet, setUpdateTweet] = useState(tweet);
    const [isLoading, setLoading] = useState(false);
    const [file, setFile] = useState<File|null>(null);

    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");
        if(!ok || user?.uid !== userId) return;
        try{
            await deleteDoc(doc(db,"tweets",id));
            if(photo) {
                const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
                await deleteObject(photoRef);

            }
        }catch (e) {
            console.log(e);
        }
    }

    const onIsEdit = () => {
        if(user?.uid !== userId) return;
        setIsEdit((status: boolean)=>!status);
    }

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setUpdateTweet(e.target.value);
    }

    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if(files && files.length === 1) {
            setFile(files[0]);
        }
    }

    const onPost = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(user?.uid !== userId) return;
        if(!user || isLoading || updateTweet === "" || updateTweet.length > 180) return;
        tweet = updateTweet;
        try{
            const docRef = doc(db,"tweets",id);
            setLoading(true);
            await updateDoc(docRef, {
                tweet,
                updatedAt:Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid
            })

            if(file) {
                const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref)
                await updateDoc(docRef, {
                    photo: url
                })
            }

            setFile(null);


        } catch (e) {
            console.log(e);
            setLoading(false);
        } finally {
            setLoading(false);
        }
        setIsEdit(false);
    }

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {isEdit ?
                    <TextArea onChange={onChange} value={updateTweet} placeholder={"What is Happening?"} required/> :
                    <Payload>{tweet}</Payload>
                }
                {user?.uid === userId ? (
                    <>

                        {isEdit ?
                            <>
                                <Button className="postBtn" onClick={onPost}>Post</Button>
                                <Button onClick={onIsEdit}>Cancel</Button>
                            </>:
                            <>
                                <Button onClick={onDelete}>Delete</Button>
                                <Button className="editBtn" onClick={onIsEdit}>Edit</Button>
                            </>
                        }

                    </>
                ) : null}
            </Column>
            <Column>
                <PhotoUpload htmlFor="photo">
                {photo ? <Photo src={photo}/>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                }
                </PhotoUpload>
                {isEdit ?
                <PhotoInput
                    onChange={onFileChange}
                    id="photo"
                    type="file"
                    accept="image/*"
                /> : null}
            </Column>
        </Wrapper>
    );
}