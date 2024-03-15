import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Tooltip, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react"
import { useEffect } from "react";
import { db } from "../Firebase";
import { collection , getDocs } from "@firebase/firestore";







const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const  TableFlats =() => {
  const flatsCollectionRef = collection(db , "flats")
  const [information , setInformation] = useState([])
  const getFlats = async () =>{
    const response = await getDocs(flatsCollectionRef) ; 
    setInformation([])
    setInformation(response.docs.map((doc=>({...doc.data() , id : doc.id}))))
}
  useEffect(()=>getFlats, [])
  
  
  return (
    <>
      <TableContainer sx={{ width: "80%" , marginLeft: '10%' }} >
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">City</StyledTableCell>
              <StyledTableCell align="center">Street</StyledTableCell>
              <StyledTableCell align="center">Street Number</StyledTableCell> 
              <StyledTableCell align="center">Area Size</StyledTableCell>
              <StyledTableCell align="center">Has AC</StyledTableCell>
              <StyledTableCell align="center">Year Built</StyledTableCell>
              <StyledTableCell align="center">Rent Price</StyledTableCell>
              <StyledTableCell align="center">Date Available</StyledTableCell>
              <StyledTableCell align="center">Favorite</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {information.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                    {row.city}
                </StyledTableCell>
                <StyledTableCell align="center">{row.streetName}</StyledTableCell>
                <StyledTableCell align="center">{row.streetNumber}</StyledTableCell>
                <StyledTableCell align="center">{row.areaSize}</StyledTableCell>
                <StyledTableCell align="center">{row.hasAC ? 'Yes' : 'No'}</StyledTableCell>
                <StyledTableCell align="center">{row.yearBuilt}</StyledTableCell>
                <StyledTableCell align="center">{row.rentPrice}</StyledTableCell>
                <StyledTableCell align="center">{row.dateAvailable}</StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Favorite">
                    <IconButton>
                      <FavoriteIcon sx={{hover: 'red'}}/>
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export { TableFlats } ; 