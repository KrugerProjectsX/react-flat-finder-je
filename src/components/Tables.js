import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
} from "@firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getUser, getUserLogged } from "../services/users";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableFlats = ({ type ,  user, setUser}) => {
  const refFav = collection(db, "favorites");
  const userId = JSON.parse(localStorage.getItem("user_logged"));
  const [flats, setFlats] = useState([]);
  const [city, setCity] = useState("");
  const [rentPrice, setRentPrice] = useState(0);
  const [areaSize, setAreaSize] = useState(0);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  

  const capitalizeFirstLetter = (word) =>{
    if (!word){
      return ''
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  }
  

  const getData = async () => {
    setLoading(true);
    const ref = collection(db, "flats");
    let arrayWhere = [];

    if (type === "my-flats") {
      const search = query(ref, where("user", "==", userId));
      const data = await getDocs(search);
      const forRowsMy = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      setFlats(forRowsMy);
    }
    if (type === "favorite-flats") {
      const search = query(refFav, where("userId", "==", userId));
      const data = await getDocs(search);
      const allFlats = [];
      for (const item of data.docs) {
        const refFlat = doc(db, "flats", item.data().flatId);
        const dataFlat = await getDoc(refFlat);
        allFlats.push({
          ...dataFlat.data(),
          id: dataFlat.id,
          favorite: item.id,
        });
      }
      setFlats(allFlats);
    }
    if (type === "all-flats") {
      if (city) {
        arrayWhere.push(where("city", "==", city));
      }
      if (areaSize) {
        let settings = areaSize.split("-");
        arrayWhere.push(where("areaSize", ">=", parseInt(settings[0])));
        arrayWhere.push(where("areaSize", "<=", parseInt(settings[1])));
      }
      if (rentPrice) {
        let settings = rentPrice.split("-");
        arrayWhere.push(where("rentPrice", ">=", parseInt(settings[0])));
        arrayWhere.push(where("rentPrice", "<=", parseInt(settings[1])));
      }
      let searchFlats = query(ref, ...arrayWhere);
      const results = await getDocs(searchFlats);
      const allFlats = [];
      for (const item of results.docs) {
        const search = query(
          refFav,
          where("userId", "==", userId),
          where("flatId", "==", item.id)
        );
        const dataFav = await getDocs(search);
        let favorite = false;

        if (dataFav.docs.length > 0) {
          favorite = dataFav.docs[0].id;
        }
        const flatWhitFav = { ...item.data(), id: item.id, favorite: favorite };
        allFlats.push(flatWhitFav);
      }
      

      setFlats(allFlats);
    }
    setLoading(false);
  };
  const addFavorite = async (id) => {
    console.log(userId, id);
    const data = {
      userId: userId,
      flatId: id,
    };
    await addDoc(refFav, data);
    setFlag(!flag);
  };
  const removeFavorite = async (id) => {
    const refRemoveFav = doc(db, "favorites", id);
    await deleteDoc(refRemoveFav);
    setFlag(!flag);
  };
  const removeFlat = async (id) =>{
    const refRemove = doc(db , 'flats' , id) ;
    await deleteDoc(refRemove) ;
    setFlag(!flag)
  }
  const handleSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b) =>{
      const  cityA = a.city.toLowerCase()
      const  cityB = b.city.toLowerCase()
      if(isAscending){
        return  cityA.localeCompare(cityB)
      }else{
        return cityB.localeCompare(cityA);
      }
    })
    setFlats(sortedData)
    setIsAscending(!isAscending);
  }

  const handleAreaSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b)=>{
      const areaSizeA = a.areaSize
      const areaSizeB = b.areaSize
      if(isAscending){
        return areaSizeA - areaSizeB
      }else{
        return areaSizeB - areaSizeA
      }
    })
    setFlats(sortedData) ; 
    setIsAscending(!isAscending)
  }

  const handlePriceSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b)=>{
      const priceA = a.rentPrice
      const priceB = b.rentPrice
      if(isAscending){
        return priceA - priceB
      }else{
        return priceB - priceA
      }
    })
    setFlats(sortedData) ; 
    setIsAscending(!isAscending)
  }

  useEffect(() => {
    getData();
  }, [city, areaSize,rentPrice]);
  useEffect(() => {
    getData();
  }, [flag]);

  return (
    <>
      {type === "all-flats" && (
        <Box
          textAlign={"center"}
          sx={{ width: "60%", marginLeft: "20%", marginTop: "50px" }}
          component={"form"}
          boxShadow={3}
          p={4}
          borderRadius={4}
        >
          <TextField
            label="City"
            variant="outlined"
            value={city}
            onChange={(e) =>{
              const inputValue = e.target.value
              const capitalized = capitalizeFirstLetter(inputValue)
              setCity(capitalized)}}
            fullWidth
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label={"Area Size Range"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <option key={"none"} value={""}></option>
            <option key={"100-200"} value={"100-200"}>
              {" "}
              100 - 200
            </option>
            <option key={"201-300"} value={"201-300"}>
              {" "}
              201 - 300{" "}
            </option>
            <option key={"301-400"} value={"301-400"}>
              {" "}
              301 - 400{" "}
            </option>
            <option key={"401-500"} value={"401-500"}>
              {" "}
              401 - 500{" "}
            </option>
            <option key={"501-600"} value={"501-600"}>
              {" "}
              501 - 600{" "}
            </option>
            <option key={"601-700"} value={"601-700"}>
              {" "}
              601 - 700{" "}
            </option>
            <option key={"701-800"} value={"701-800"}>
              {" "}
              701 - 800{" "}
            </option>
            <option key={"801-900"} value={"801-900"}>
              {" "}
              801 - 900{" "}
            </option>
            <option key={"901-1000"} value={"901-1000"}>
              {" "}
              901 - 1000{" "}
            </option>
            <option key={"1001-max"} value={"1001-999999"}>
              {" "}
              + 1001{" "}
            </option>
          </TextField>
          <TextField
            select
            label={"Rent Price Range"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <option key={"none"} value={""}></option>
            <option key={"100-200"} value={"100-200"}>
              {" "}
              100 - 200
            </option>
            <option key={"201-300"} value={"201-300"}>
              {" "}
              201 - 300{" "}
            </option>
            <option key={"301-400"} value={"301-400"}>
              {" "}
              301 - 400{" "}
            </option>
            <option key={"401-500"} value={"401-500"}>
              {" "}
              401 - 500{" "}
            </option>
            <option key={"501-600"} value={"501-600"}>
              {" "}
              501 - 600{" "}
            </option>
            <option key={"601-700"} value={"601-700"}>
              {" "}
              601 - 700{" "}
            </option>
            <option key={"701-800"} value={"701-800"}>
              {" "}
              701 - 800{" "}
            </option>
            <option key={"801-900"} value={"801-900"}>
              {" "}
              801 - 900{" "}
            </option>
            <option key={"901-1000"} value={"901-1000"}>
              {" "}
              901 - 1000{" "}
            </option>
            <option key={"1001-max"} value={"1001-999999"}>
              {" "}
              + 1001{" "}
            </option>
          </TextField>
        </Box>
      )}{" "}
      <br />
      <br />
      <br />
      {flats.length === 0 && !loading ? ( // Agrega la condición de carga para evitar que la alerta aparezca antes de cargar los datos
        <Alert severity="error" sx={{ margin: "20px auto", width: "60%" }}>
          There is not any match, try again.
        </Alert>
      ) : loading ? ( // Muestra el CircularProgress mientras se cargan los datos
        <div className="flex justify-center content-center">
          <CircularProgress />
        </div>
      ) :(
      <TableContainer 
        className="flex justify-between"
        sx={{
          width: "80%",
          marginLeft: "10%",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflow: "hidden",
          
        }}>

        <Table >
          <TableHead  >
            <TableRow>
              <StyledTableCell onClick={handleSort} align="center">City</StyledTableCell>
              <StyledTableCell align="center">Street</StyledTableCell>
              <StyledTableCell align="center">Street Number</StyledTableCell>
              <StyledTableCell onClick={handleAreaSort} align="center">Area Size</StyledTableCell>
              <StyledTableCell align="center">Has AC</StyledTableCell>
              <StyledTableCell align="center">Year Built</StyledTableCell>
              <StyledTableCell onClick={handlePriceSort} align="center">Rent Price</StyledTableCell>
              <StyledTableCell align="center">Date Available</StyledTableCell>
              {type==="favorite-flats"?(<StyledTableCell align="center">View</StyledTableCell>):(<StyledTableCell align="center">Favorites</StyledTableCell>) }
              {type==="favorite-flats"?(<StyledTableCell align="center">Edit</StyledTableCell>):(<StyledTableCell align="center">View</StyledTableCell>) }
              {type === 'my-flats' && <StyledTableCell align="center">Delete</StyledTableCell> }
              {type === 'all-flats' && user.role === 'admin' &&  <StyledTableCell align="center">Delete</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody >
            {flats.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.city}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.streetName}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.streetNumber}
                </StyledTableCell>
                <StyledTableCell align="center">{row.areaSize}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.hasAC ? "Yes" : "No"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.yearBuilt}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.rentPrice}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.dateAvailable}
                </StyledTableCell>
                {type === "all-flats" && (
                  <StyledTableCell align="center">
                    {!row.favorite && (
                      <Button
                        variant="outlined"
                        onClick={() => addFavorite(row.id)}
                      >
                        Add Favorite
                      </Button>
                    )}
                    {row.favorite && (
                      <Button
                        variant="outlined"
                        onClick={() => removeFavorite(row.favorite)}
                      >
                        Remove Favorite
                      </Button>
                    )}
                  </StyledTableCell>
                )}
                {type === "favorite-flats" && (
                  <StyledTableCell align="center">
                    {
                      <Button
                        variant="outlined"
                        onClick={() => removeFavorite(row.favorite)}
                      >
                        Remove Favorite
                      </Button>
                    }
                  </StyledTableCell>
                )}
                <StyledTableCell align="center">
                  <Button variant="contained" href={`/flat/${row.id}`}>
                    View
                  </Button>
                </StyledTableCell>
                  {type === "my-flats" && ( <StyledTableCell>
                    <Button href={`/flat/edit/${row.id}`}>Edit</Button></StyledTableCell>
                  )}
                
                {type === "my-flats" && 
                <StyledTableCell align="center"><Button onClick={() => removeFlat(row.id)}>Delete</Button></StyledTableCell>
                }
                 {type === 'all-flats' && user.role === 'admin' &&  <StyledTableCell align="center"><Button onClick={() => removeFlat(row.id)}>Delete</Button></StyledTableCell>}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </>
  );
};

export { TableFlats };
