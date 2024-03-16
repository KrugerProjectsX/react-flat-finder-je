import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { doc, updateDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";



export default function FormRegister({ type, onSuccessRedirect }) {
  const navigate=useNavigate()
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const currentDate = new Date().toISOString().slice(0, 10);
  const [userLoaded, setUserLoaded] = useState(false);
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const birthdayRef = useRef(currentDate);
  const id = JSON.parse(localStorage.getItem("user_logged"));

  const refCreate = collection(db, "users");
  let ref = null;
  if (id) {
    ref = doc(db, "users", id);
  }

  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0]; //
  const maxBirthDate = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0]; // Fecha máxima para tener 120 años

  const handleSubmit = async (event) => {
   
    event.preventDefault();
    let user = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      birthday: birthdayRef.current.value,
    };
    
    if (type === "create") {
      user.password = passwordRef.current.value;
      await addDoc(refCreate, user);
      showAlertMessage("success", "User created successfully.");
      navigate('/',  {replace: true})
      console.log(user)
    }
    if (type === "update") {
      await updateDoc(ref, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthday: user.birthday,
      });
      showAlertMessage("success", "Profile updated successfully.");
    }
    if (type === "view") {
      console.log(user);
      showAlertMessage("info", "Profile loaded successfully.");
    }
  };

  let nameButton = "Create";

  if (type === "update") {
    nameButton = "Update";
  }
  if (type === "create") {
    nameButton = "Sign Up";
  }

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
  });

  const getUserData = async () => {
    try {
      const dataUser = await getDoc(ref);
      if (dataUser.exists()) {
        const responseUser = { ...dataUser.data() };
        setUser(responseUser); // Actualizar el estado del usuario
        setUserLoaded(true);
      } else {
        // El documento no existe, puedes manejar esta situación como desees
        console.log("El documento no existe");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      // Puedes mostrar una alerta de error o manejar el error de otra manera
    }
  };

  const processData = async () => {
    if (type === "view" || type === "update") {
      await getUserData();
    } else {
      setUserLoaded(true);
    }
  };
  useEffect(() => {
    processData();
  }, []);

  return (
    <>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {showAlert && (
          <Stack sx={{ width: "100%" }} spacing={2} mb={2}>
            <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          </Stack>
        )}
        {userLoaded ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view"}
                  autoComplete="given-name"
                  defaultValue={user.firstName}
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputRef={firstNameRef}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  disabled={type === "view"}
                  defaultValue={user.lastName}
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  inputRef={lastNameRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={type === "view"}
                  required
                  defaultValue={user.email}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={emailRef}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                {type === "create" && (
                  <TextField
                    defaultValue={user.password}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    inputRef={passwordRef}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {/* <p className="text-blue-500">Birthday</p> */}
                <TextField
                  required
                  fullWidth
                  disabled={type === "view"}
                  defaultValue={user.birthday}
                  name="birthday"
                  inputProps={{ min: maxBirthDate, max: minBirthDate }}
                  label={type !== "create" ? "Birthday" : null}
                  type="date"
                  id="birthday"
                  autoComplete="birthday"
                  inputRef={birthdayRef}
                />
              </Grid>
            </Grid>
            {type !== "view" && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {nameButton}
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                {type === "create" && (
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </>
  );
}
