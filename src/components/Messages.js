import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, TextField } from "@mui/material";

export default function Messages({ flatId }) {
  const ref = doc(db, "flats", flatId);
  const refMessages = collection(db, "messages");

  const [flat, setFlat] = useState({});
  //type = view | type = create
  const [type, setType] = useState("create");
  const [messages, setMessages] = useState([]);
  const messageInput = useRef("");

  const getMessages = async () => {
    const search = query(refMessages, where("flatId", "==", flatId));
    const dataMessages = await getDocs(search);
    const rows = dataMessages.docs.map((item) => {
      const message = { ...item.data(), id: item.id };
      message.timestamp = message.timestamp.toDate();
      return message;
    });
    const newMessages= [];
    for( const item of rows ) {
      const refUser = doc(db, "users", item.userId);
      const dataUser = await getDoc(refUser);
      const userMessage= {...dataUser.data() };
      newMessages.push({...item, user:userMessage })
    }

    setMessages(newMessages);
  };

  const getFlat = async () => {
    const userId = JSON.parse(localStorage.getItem("user_logged"));
    const dataFlat = await getDoc(ref);
    const responseFlat = { ...dataFlat.data() };
    console.log(responseFlat, userId);
    if (responseFlat.user === userId) {
      setType("view");
      await getMessages();
    } else {
      setType("create");
    }
    setFlat(responseFlat);
  };

  useEffect(() => {
    getFlat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = messageInput.current.value;
    const data = {
      message: message,
      flatId: flatId,
      userId: JSON.parse(localStorage.getItem("user_logged")),
      timestamp: Timestamp.fromDate(new Date()),
    };
    await addDoc(refMessages, data);
  };
  return (
    <div>
      <h1>Messages</h1>
      {type === "create" && (
        <>
          <Box
            component={"form"}
            onSubmit={handleSubmit}
            className="flex
        flex-col
        items-center
        justify-center
        p-4
        rounded-lg
        bg-gray-200
        shadow-md"
          >
            <TextField
              type={"text"}
              label={"Message"}
              inputRef={messageInput}
              multiline
              maxRows={10}
              minRows={10}
              className="mb-4"
            />
            <Button
              type={"submit"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </Button>
          </Box>
        </>
      )}
      {type === "view" && (
        <>
          {messages.map((item) => {
            const messageTime = new Date(item.timestamp).toLocaleTimeString();
            const messageDate = new Date(item.timestamp).toLocaleDateString();
            return (
              <div
                key={item.id}
                className="border p-4 m-4 rounded-full bg-blue-100"
              >
                <p className="text-center">
                  {item.user.firstName} sent a message at {messageDate} {messageTime}
                </p>
                <p className="text-center">{item.message}</p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}