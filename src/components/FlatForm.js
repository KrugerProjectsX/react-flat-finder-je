import Box from "@mui/material/Box";
import { Button, Switch, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert'
export default function FlatForm({ type, id}) {
 
  const [flatLoaded, setFlatLoaded] = useState(false);
  const currentDate = new Date().toJSON().slice(0, 10);
  const flatsRef = collection(db, "flats");
  const [flat, setFlat] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAc: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: currentDate,
  });


  const navigate = useNavigate();
  const date = new Date().toJSON().slice(0, 10);
  const city = useRef("");
  const streetName = useRef("");
  const streetNumber = useRef("");
  const areaSize = useRef("");
  const hasAC = useRef(false);
  const yearBuilt = useRef("");
  const rentPrice = useRef("");
  const dateAvailable = useRef("");
  let refFlat = null;
  const [showAlert, setShowAlert] = useState(false);
  const user = JSON.parse(localStorage.getItem("user_logged"));
  
  if (id && type !== "create") {
    refFlat = doc(db, "flats", id);
  }
 
  const capitalizeFirstLetter = (word) =>{
    if (!word){
      return ''
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const refUser = doc(db,"users",user)
     const dataUser = await getDoc(refUser);


    const onlyLetters = () => {
      if (
        city.current.value.length < 2 ||
        streetName.current.value < 2 ||
        streetName.current.value < 2
      ) {
        return false;
      } else {
        return true;
      }
    };
    

    const forCity = () => {
      const validate = /^[a-zA-Z\s]+$/; // updated regular expression
      if (
        validate.test(city.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };
    const forStreet = () => {
      const validate = /^[a-zA-Z\s.,'0-9]+$/; // updated regular expression
      if (
        validate.test(streetName.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };


    const onlyNumbers = () => {
      const validate = /^[0-9]+$/;
      if (
        validate.test(areaSize.current.value) &&
        validate.test(rentPrice.current.value) &&
        validate.test(yearBuilt.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };
    
    let flatForSubmit = {
      city: city.current.value,
      streetName: streetName.current.value,
      streetNumber: streetNumber.current.value,
      areaSize: parseInt(areaSize.current.value),
      hasAC: hasAC.current.checked,
      yearBuilt: yearBuilt.current.value,
      rentPrice: parseInt(rentPrice.current.value),
      dateAvailable: dateAvailable.current.value,
      user: JSON.parse(localStorage.getItem("user_logged")),
      nameUser: dataUser.data().firstName,
      emailUser: dataUser.data().email
    }
    
    console.log(onlyLetters(),forCity() ,forStreet(), onlyNumbers(),  yearBuilt.current.value);
    if (
      onlyLetters() &&
      forCity() &&
      forStreet()&&
      onlyNumbers() &&
      yearBuilt.current.value < 2024 &&
      city.current.value &&
      streetName.current.value &&
      streetNumber.current.value &&
      areaSize.current.value &&
      rentPrice.current.value &&
      dateAvailable.current.value 
    ) {
    
      if(type === 'update'){
        
        await updateDoc(refFlat , flatForSubmit )

      }else{ await addDoc(flatsRef, flatForSubmit);}
      setShowAlert(true);
      setTimeout(() => {
        navigate("/my-flats", { replace: false });
      }, 2000);
    } else {
      alert("You need to fill correctly the information");
    }
  };
  const getFlatData = async () => {
    const dataFlat = await getDoc(refFlat);
  const responseFlat = { ...dataFlat.data() };
  const userId = responseFlat.user;
  const refUser = doc(db, "users", userId);
  const dataUser = await getDoc(refUser);
  responseFlat.firstName = dataUser.data().firstName;
  responseFlat.lastName = dataUser.data().lastName;
  setFlat(responseFlat);
  setFlatLoaded(true);
};
  const processData = async () => {
    if (type === "update" || type === "view") {
      await getFlatData();
    } else {
      setFlatLoaded(true);
    }
  };

  useEffect(() => {
    processData();
  }, []);

  return (
    <>
    <Box
      onSubmit={handleSubmit}
      sx={{
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "2.5%",
        textAlign: "center",
      }}
      component={"form"}
      className="mx-auto mt-10 sm:w-2/5 bg-gray-100 p-6 rounded-lg shadow-lg"
    >
      {flatLoaded ? (
        <>
        {type === "create" && (
          <Typography
            fontWeight={"bold"}
            component={"h2"}
            className="text-black text-2xl md:text-3xl lg:text-4xl"
          > 
            Create Your Flat
          </Typography>
        )}
        {type === "view"&&(
          <Typography variant="h6">Flat Owner: {flat.firstName} {flat.lastName} </Typography>
        )}
          <br />
          {showAlert && <Alert severity="success">You have created a new flat.</Alert>}
          <div className="flex flex-col md:flex-row lg:flex-row">
            <TextField
              disabled={type === "view"}
              label="City"
              value={flat.city}
              inputRef={city}
              variant="outlined"
              className="mb-2 md:mr-2 lg:mr-4 md:mb-0 lg:mb-0 flex-grow"
              onChange={(e) =>{
                const inputValue = e.target.value
                const capitalized = capitalizeFirstLetter(inputValue);
                setFlat({ ...flat, city: capitalized })
              }}
              required
            />
            <TextField
              disabled={type === "view"}
              label="Street name"
              defaultValue={flat.streetName}
              inputRef={streetName}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
          </div>
          <br />
          <div className="flex flex-col md:flex-row lg:flex-row">
            <TextField
              disabled={type === "view"}
              label="Street number"
              defaultValue={flat.streetNumber}
              inputRef={streetNumber}
              variant="outlined"
              className="mb-2 md:mr-2 lg:mr-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
            <TextField
              disabled={type === "view"}
              label="Area size"
              type="number"
              defaultValue={flat.areaSize}
              inputRef={areaSize}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
          </div>
          <br />
          <div className="flex flex-col md:flex-row lg:flex-row">
            <div className="flex items-center mb-2 md:mr-2 lg:mr-4 md:mb-0 lg:mb-0">
              <Switch
                disabled={type === "view"}
                defaultValue={flat.hasAc}
                inputRef={hasAC}
              
              />
              <label htmlFor="switch" className="ml-2">
                Has AC
              </label>
            </div>
            <TextField
              defaultValue={flat.yearBuilt}
              disabled={type === "view"}
              label="Year built"
              type="number"
              // inputProps={{ min: 1900, max: 2050 }}
              inputRef={yearBuilt}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
          </div>
          <br />
          <div className="flex flex-col md:flex-row lg:flex-row">
            <TextField
              defaultValue={flat.rentPrice}
              disabled={type === "view"}
              label="Rent price"
              type="number"
              inputRef={rentPrice}
              variant="outlined"
              className="mb-2 md:mr-2 lg:mr-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
            <TextField
              disabled={type === "view"}
              defaultValue={flat.dateAvailable}
              type="date"
              label="Date available"
              defaultValue={date}
              inputRef={dateAvailable}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
              required
            />
          </div>
          <br />
          {type !== "view" && (
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </Button>
          )}
          {/*TODO: Add the update button*/}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
    </>
  );
}
