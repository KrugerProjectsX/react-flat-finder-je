import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { doc, updateDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";

export default function FormRegister({ type }) {
const currentDate = new Date().toISOString().slice(0, 10); 
  const [userLoaded, setUserLoaded] = useState(false);
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const birthdayRef = useRef(currentDate);
  const id = JSON.parse(localStorage.getItem("user_logged"));
  const ref = doc(db, "users", id);
  const refCreate = collection(db, "users");

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
      await addDoc(refCreate, user);
    }
    console.log(user);

    if (type === "update") {
      await updateDoc(ref, user);
    }
    if (type === "view") {
      console.log(user);
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
    // Corregir la función getUserData
    const dataUser = await getDoc(ref);
    const responseUser = { ...dataUser.data() };
    setUser(responseUser); // Actualizar el estado del usuario
    setUserLoaded(true);
  };

  const processData = async () => {
    if (type === "view" || type === "update") {
      await getUserData();
    }
  };
  useEffect(() => {
    processData();
  }, []);

  return (
    <>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {userLoaded ? (
        <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              disable={type === "view"}
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
              disable={type === "view"}
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
              disable={type === "view"}
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
              defaultValue={user.birthday}
              name="birthday"
              inputProps={{ min: maxBirthDate, max: minBirthDate }}
              label="Birthday"
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
            <Link href="/" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
        </>
      ): (
        <p>Loading...</p>
    )}
        
      </Box>
    </>
  );
}
