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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function FormRegister({ type, onSuccessRedirect, userId }) {
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(true); // Estado para controlar si todos los campos están llenos

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
  const roleRef = useRef("");
  

  let ref = null;
  if (userId===null && type !== "create"){
    userId=JSON.parse(localStorage.getItem("user_logged")); 
   
  }
  if (userId && type !== "create"){
     ref = doc(db, "users", userId);
  }

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
    // Validar cada campo individualmente
    const firstNameValidation = validate(
      firstNameRef.current.value,
      "firstName"
    );
    const lastNameValidation = validate(lastNameRef.current.value, "lastName");
    const emailValidation = validate(emailRef.current.value, "email");
    const passwordValidation = validate(passwordRef.current.value, "password");

    // Verificar si alguna validación falló
    if (
      firstNameValidation !== "" ||
      lastNameValidation !== "" ||
      emailValidation !== "" ||
      passwordValidation !== ""
    ) {
      // Mostrar la alerta si algún campo no pasa la validación
      showAlertMessage("error", "Please fill in all fields correctly.");
      return;
    }

    if (
      firstNameRef.current.value === "" ||
      lastNameRef.current.value === "" ||
      emailRef.current.value === "" ||
      passwordRef.current.value === "" ||
      birthdayRef.current.value === "" ||
      roleRef.current.value === ""
    ) {
      showAlertMessage("error", "Please fill in all required fields.");
      setAllFieldsFilled(false);
      return;
    }
    let user = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      birthday: birthdayRef.current.value,
      role: roleRef.current.value,
    };

    if (type === "create") {
      user = { ...user, password: passwordRef.current.value };
      await addDoc(refCreate, user);
      showAlertMessage("success", "User created successfully.");
      navigate("/", { replace: true });
      console.log(user);
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
        console.log(responseUser);
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

  // const [ userType,  setUserType] = React.useState('');

  // const handleChange = (event) => {
  //   setUserType(event.target.value);
  // };

  //validation sign up
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstNameError(validate(event.target.value, "firstName"));
  };

  const handleLastNameChange = (event) => {
    setLastNameError(validate(event.target.value, "lastName"));
  };

  const handleEmailChange = (event) => {
    setEmailError(validate(event.target.value, "email"));
  };

  const handlePasswordChange = (event) => {
    setPasswordError(validate(event.target.value, "password"));
  };

  const validate = (value, type) => {
    if (type === "firstName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "First name must be a string without numbers.";
      }
    }

    if (type === "lastName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Last name must be a string without numbers.";
      }
    }

    if (type === "email") {
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
        return "Email must be a valid email address.";
      }
    }

    if (type === "password") {
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value)) {
        return "Password must have at least one number, one lowercase letter, one uppercase letter, and be at least 6 characters long.";
      }
    }

    return "";
  };
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
                  error={firstNameError !== ""}
                  helperText={firstNameError}
                  onChange={handleFirstNameChange}
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
                  error={lastNameError !== ""}
                  helperText={lastNameError}
                  onChange={handleLastNameChange}
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
                  error={emailError !== ""}
                  helperText={emailError}
                  onChange={handleEmailChange}
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    inputRef={passwordRef}
                    error={passwordError !== ""}
                    helperText={passwordError}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordToggle}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                  type={type === "view" ? "text" : "date"} 
                  id="birthday"
                  autoComplete="birthday"
                  inputRef={birthdayRef}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    required
                    labelId="role"
                    id="role"
                    // value={userType}
                    label="role"
                    // onChange={handleChange}
                    inputRef={roleRef}
                  >
                    <MenuItem value={"landlord"}>Landlord</MenuItem>
                    <MenuItem value={"renter"}>Renter</MenuItem>
                  </Select>
                </FormControl>
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
