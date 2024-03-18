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
import { collection , getDocs , query, where } from "@firebase/firestore";








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

const  TableFlats =({type}) => {
const userId= JSON.parse(localStorage.getItem('user_logged'))
const [flats , setFlats] = useState([])
const getData = async () =>{ 
    const ref = collection(db , 'flats')
    if (type === 'my-flats'){
        const search = query(ref , where('user' , '==', userId ))
        const data = await getDocs(search)
        const forRows = data.docs.map((item)=>{
            return {...item.data() , id: item.id}
        })
        setFlats(forRows)
    }
    if(type === 'favorite-flats'){

    }
    if(type === 'all-flats'){
        const response = await getDocs(ref)
        const forRows = response.docs.map((item)=>{
            return {...item.data() , id: item.id}
        })
        setFlats(forRows)
    }

}

    useEffect(()=>{getData()}, [])

  
  
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
            {flats.map((row) => (
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