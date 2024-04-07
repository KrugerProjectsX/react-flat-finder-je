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
import SendIcon from '@mui/icons-material/Send';

export default function Messages({ flatId }) {
  const ref = doc(db, "flats", flatId);
  const refMessages = collection(db, "messages");

  const [flat, setFlat] = useState({});
  const [type, setType] = useState("create");
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [responseInput, setResponseInput] = useState("");
  const messageInput = useRef("");

  const getMessages = async () => {
    const search = query(refMessages, where("flatId", "==", flatId));
    const dataMessages = await getDocs(search);
    const rows = dataMessages.docs.map((item) => {
      const message = { ...item.data(), id: item.id };
      message.timestamp = message.timestamp.toDate();
      return message;
    });
    const newMessages = [];
    for (const item of rows) {
      const refUser = doc(db, "users", item.userId);
      const dataUser = await getDoc(refUser);
      const userMessage = { ...dataUser.data() };
      newMessages.push({ ...item, user: userMessage });
    }

    setMessages(newMessages);
  };

  const getFlat = async () => {
    const userId = JSON.parse(localStorage.getItem("user_logged"));
    const dataFlat = await getDoc(ref);
    const responseFlat = { ...dataFlat.data() };
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

    messageInput.current.value = "";
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
    }, 3000);
  };

  const handleResponseSubmit = async () => {
    const responseMessage = responseInput.trim();
    if (responseMessage !== "") {
      const data = {
        message: responseMessage,
        flatId: flatId,
        userId: JSON.parse(localStorage.getItem("user_logged")),
        timestamp: Timestamp.fromDate(new Date()),
      };
      await addDoc(refMessages, data);
      setResponseInput("");
      await getMessages();
    }
  };

  return (
    <div>
      <h1>Messenger</h1>
      {type === "create" && (
        <>
          <Box
            component={"form"}
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 shadow-md"
          >
            {messageSent && <p className="mb-2 text-green-500">Message sent</p>}
            <TextField
              type={"text"}
              label={"Message"}
              inputRef={messageInput}
              multiline
              maxRows={3}
              minRows={3}
              className="mb-4 w-1/2"
              variant="outlined"
              InputProps={{
                className: "bg-white rounded-md",
              }}
            />
            <Button
              type={"submit"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              variant="contained" endIcon={<SendIcon />}
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
                className={`max-w-xs mx-auto my-4 p-4 rounded-lg shadow ${item.userId === JSON.parse(localStorage.getItem("user_logged")) ? "bg-emerald-300" : "bg-blue-100"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">{item.user.firstName}</p>
                  <p className="text-xs text-gray-500">
                    {messageDate} {messageTime}
                  </p>
                </div>
                <p className="text-base">{item.message}</p>
              </div>
            );
          })}
          <div className="flex justify-center items-center mt-4">
            <TextField
              type={"text"}
              label={"Response"}
              value={responseInput}
              onChange={(e) => setResponseInput(e.target.value)}
              variant="outlined"
              className="mr-2"
            />
            <Button
              onClick={handleResponseSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
