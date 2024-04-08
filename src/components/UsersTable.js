import * as React from "react";
import Table from "@mui/material/Table";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import { Slider, Typography } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { getDocs, query, where, collection , doc , deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";
import Button from "@mui/material/Button";

// @Params: type: "my-flats" | "all-flats" | "favorite-flats"
export default function UsersTable() {
  const ref = collection(db, "users");
  const refFlats = collection(db, "flats");
  const [userType, setUserType] = useState("");
  const [flatsCounter, setFlatsCounter] = useState(0);
  const [valueSlider, setValueSlider] = React.useState([18, 120]);
  const [users, setUsers] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [flag , setFlag] = useState(false)
  let arrayWhere = [];

  console.log(userType);
  if (userType) {
    arrayWhere.push(where("role", "==", userType));
  }
  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - valueSlider[0],
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxBirthDate = new Date(
    today.getFullYear() - valueSlider[1],
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  if (valueSlider && valueSlider.length > 1) {
    arrayWhere.push(where("birthday", ">=", maxBirthDate));
    arrayWhere.push(where("birthday", "<=", minBirthDate));
  }
  const getData = async () => {
    let searchUsers = query(ref, ...arrayWhere);
    const data = await getDocs(searchUsers);
    const usersSet = [];
    // Conjunto para almacenar usuarios únicos

    // Iterar sobre los usuarios y agregarlos al conjunto
    for (const item of data.docs) {
      const search = query(refFlats, where("user", "==", item.id));
      const dataFlats = await getDocs(search);
      if (flatsCounter) {
        const flatsValue = flatsCounter.split("-");
        if (flatsValue.length > 1) {
          const min = flatsValue[0];
          const max = flatsValue[1];
          if (dataFlats.docs?.length <= min || dataFlats.docs?.length >= max) {
            continue;
          }
        } else {
          if (flatsValue[0] === "61+") {
            if (dataFlats.docs?.length < 61) {
              continue;
            }
          }
        }
      }
      const userWithFlats = {
        ...item.data(),
        id: item.id,
        flats: dataFlats.docs?.length,
      };
      usersSet.push(userWithFlats);
    }

    setUsers(usersSet);
    
  };
  const removeFlat = async (id) =>{
    const refRemove = doc(db , 'users' , id) ;
    await deleteDoc(refRemove) ;
    setFlag(!flag)
  }
  const nameSort = () =>{
    const sortedData = [...users]
    sortedData.sort((a , b) =>{
      const  nameA = a.firstName.toLowerCase()
      const  nameB = b.firstName.toLowerCase()
      if(isAscending){
        return  nameA.localeCompare(nameB)
      }else{
        return nameB.localeCompare(nameA);
      }
    })
    setUsers(sortedData)
    setIsAscending(!isAscending);
  }
  const lastNameSort = () =>{
    const sortedData = [...users]
    sortedData.sort((a , b) =>{
      const  nameA = a.lastName.toLowerCase()
      const  nameB = b.lastName.toLowerCase()
      if(isAscending){
        return  nameA.localeCompare(nameB)
      }else{
        return nameB.localeCompare(nameA);
      }
    })
    setUsers(sortedData)
    setIsAscending(!isAscending);
  };
  
  const flatSort = () =>{
    const sortedData = [...users]
    sortedData.sort((a , b)=>{
      const flatsA = a.flats
      const flatsB = b.flats
      if(isAscending){
        return flatsA - flatsB
      }else{
        return flatsB - flatsA
      }
    })
    setUsers(sortedData) ; 
    setIsAscending(!isAscending)
  }
  

  useEffect(() => {
    getData();
  }, [userType, flatsCounter, valueSlider , flag]);

  return (  
    <div>
    <div  className="flex justify-center">
    <Box
     border={0}
      textAlign={"center"}
      className="p-4 rounded-2xl my-3 shadow-md"
      component={"form"}
     
    >
      <TextField
        select
        label={"User Type"}
        variant="outlined"
        SelectProps={{ native: true }}
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="my-4 mx-4 "
      >
        <option key={"none"} value={""}></option>
        <option key={"100-200"} value={"admin"}>
          Admin
        </option>
        <option key={"200-300"} value={"landlord"}>
          Landlord
        </option>
        <option key={"300-400"} value={"renter"}>
          Renter
        </option>
      </TextField>

      <TextField
        select
        label={"Flats Count"}
        variant="outlined"
        SelectProps={{ native: true }}
        value={flatsCounter}
        onChange={(e) => setFlatsCounter(e.target.value)}
        className="my-4"
      >
        <option key={"none"} value={""}></option>
        <option key={"100-200"} value={"0-5"}>
          0-5
        </option>
        <option key={"200-300"} value={"6-10"}>
          6-10
        </option>
        <option key={"300-400"} value={"11-30"}>
          11-30
        </option>
        <option key={"400-500"} value={"30-61"}>
          30 - 61
        </option>
        <option key={"61-max"} value={"61-999999"}>
          61+
        </option>
      </TextField>

      <div className="w-56 my-6 mx-auto">
        <Typography id="input-slider" gutterBottom>
          Age
        </Typography>
        <Slider
          max={120}
          min={18}
          step={5}
          value={valueSlider}
          onChange={(e, newValue) => setValueSlider(newValue)}
          getAriaLabel={() => "Age Range"}
          valueLabelDisplay="auto"
          className="flex-grow"
        />
      </div>
    </Box>
    </div>
      <TableContainer>
      <Table
          className="min-w-full divide-gray-200"
          aria-label="simple table"
        >
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell onClick={nameSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </TableCell>
              <TableCell
                onClick={lastNameSort}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Last Name
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Email
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Birth Date
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Role
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
                onClick={flatSort}
              >
                Flats Count
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Update info
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white divide-y divide-gray-200">
            {users.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.firstName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.lastName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.birthday}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.role}
                </TableCell>

                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.flats}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Button href={`update-profile/${row.id}`} variant="contained">
                    Edit
                  </Button>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Button onClick={() => removeFlat(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
    </div>
  );
}
