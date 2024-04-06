import Box from "@mui/material/Box";
import { Button, Switch, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FlatForm({ type, id}) {
 
  const [flatLoaded, setFlatLoaded] = useState(false);
  const currentDate = new Date().toJSON().slice(0, 10);
  const flatsRef = collection(db, "flats");
  const [flat, setFlat] = useState({
    city: "",
    streetName: "",
    streetNumber: 0,
    areaSize: 0,
    hasAc: false,
    yearBuilt: 0,
    rentPrice: 0,
    dateAvailable: currentDate,
  });
  const navigate = useNavigate();

  const date = new Date().toJSON().slice(0, 10);
  const city = useRef("");
  const streetName = useRef("");
  const streetNumber = useRef(0);
  const areaSize = useRef(0);
  const hasAC = useRef(false);
  const yearBuilt = useRef(0);
  const rentPrice = useRef(0);
  const dateAvailable = useRef("");
  const ref = collection(db, "flats");
  let refFlat = null;
  if (id && type !== "create") {
    refFlat = doc(db, "flats", id);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "create") {
      await addDoc(ref, flat);
      navigate("/dashboard", { replace: false });
    }
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

    const forLetters = () => {
      const validate = /^[A-Za-z0-9 ,.!?\s-]+$/; // updated regular expression
      if (
        validate.test(city.current.value) &&
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
   console.log(onlyLetters(),forLetters(),onlyNumbers(),yearBuilt.current.value)
    if (
      onlyLetters() &&
      forLetters() &&
      onlyNumbers() &&
      yearBuilt.current.value < 2024
    ) {
      await addDoc(flatsRef, {
        city: city.current.value,
        streetName: streetName.current.value,
        streetNumber: streetNumber.current.value,
        areaSize: parseInt(areaSize.current.value),
        hasAC: hasAC.current.checked,
        yearBuilt: yearBuilt.current.value,
        rentPrice: parseInt(rentPrice.current.value),
        dateAvailable: dateAvailable.current.value,
        user: JSON.parse(localStorage.getItem("user_logged")),
      });
    } else {
      alert("Se requieren todos los campos");
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
          <div className="flex flex-col md:flex-row lg:flex-row">
            <TextField
              disabled={type === "view"}
              label="City"
              value={flat.city}
              inputRef={city}
              variant="outlined"
              className="mb-2 md:mr-2 lg:mr-4 md:mb-0 lg:mb-0 flex-grow"
              onChange={(e) =>
                setFlat({ ...flat, city: e.target.value })
              }
            />
            <TextField
              disabled={type === "view"}
              label="Street name"
              defaultValue={flat.streetName}
              inputRef={streetName}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
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
            />
            <TextField
              disabled={type === "view"}
              label="Area size"
              type="number"
              defaultValue={flat.areaSize}
              inputRef={areaSize}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
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
              inputProps={{ min: 1900, max: 2050 }}
              inputRef={yearBuilt}
              variant="outlined"
              className="mb-2 md:ml-2 lg:ml-4 md:mb-0 lg:mb-0 flex-grow"
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
  );
}
