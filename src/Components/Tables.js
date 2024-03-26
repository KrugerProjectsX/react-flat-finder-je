import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Box} from "@mui/system";
import { Button } from "@mui/base";
import { Tooltip, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react"
import { useEffect } from "react";
import { db } from "../Firebase";
import { collection ,  getDocs , query, where } from "@firebase/firestore";









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
const [city , setCity] = useState('') ; 
const [rentPrice , setRentPrice] = useState(0) ; 
const [areaSize , setAreaSize] = useState(0) ; 



const getData = async () =>{ 
    const ref = collection(db , 'flats')
    let arrayWhere = []

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
    if(city){
        arrayWhere.push(where('city', '==' , city))
    }
    if(areaSize){
        let settings = areaSize.split('-')
            arrayWhere.push(where('areaSize' , '>=' , parseInt(settings[0])))
            console.log(arrayWhere)
    }

    let searchFlats = query(ref , ...arrayWhere) ; 
    const results = await getDocs(searchFlats);
    const newFlats = results.docs.map((item)=>item.data())
    setFlats(newFlats)
}
 

    useEffect(()=>{getData()}, [city , areaSize])



  
  
  return (
    <>
      <Box textAlign={'center'} sx={{width: '60%' , marginLeft: '20%'}} component={'form'}>
          <TextField 
          label='City'   
          variant='outlined' 
          value={city}
          onChange={(e)=> setCity(e.target.value)}
          /><br/><br/>
          <TextField select label={ 'Area Size Range' } 
          variant="outlined" 
          SelectProps={ { native: true } } 
          value={areaSize}
          onChange={(e)=> setAreaSize(e.target.value)}>
                    <option key={ 'none' } value={ '' }></option>
                    <option key={ '100-200' } value={ '100-200' }> 100 - 200</option>
                    <option key={ '200-300' } value={ '201-300' }> 200 - 300 </option>
                    <option key={ '300-400' } value={ '301-400' }> 300 - 400 </option>
                    <option key={ '400-500' } value={ '401-500' }> 400 - 500 </option>
                    <option key={ '500-600' } value={ '501-600' }> 500 - 600 </option>
                    <option key={ '600-700' } value={ '601-700' }> 600 - 700 </option>
                    <option key={ '700-800' } value={ '701-800' }> 700 - 800 </option>
                    <option key={ '800-900' } value={ '801-900' }> 800 - 900 </option>
                    <option key={ '900-1000' } value={ '901-1000' }> 900 - 1000 </option>
                    <option key={ '1000' } value={ '+1000' }> + 1000 </option> 
          </TextField><br/><br/>
          <TextField select label={ 'Area Size Range' } 
          variant="outlined" 
          SelectProps={ { native: true } } 
          value={rentPrice}
          onChange={(e)=> setRentPrice(e.target.value)}>
                    <option key={ 'none' } value={ '' }></option>
                    <option key={ '100-200' } value={ '100-200' }> 100 - 200</option>
                    <option key={ '200-300' } value={ '201-300' }> 200 - 300 </option>
                    <option key={ '300-400' } value={ '301-400' }> 300 - 400 </option>
                    <option key={ '400-500' } value={ '401-500' }> 400 - 500 </option>
                    <option key={ '500-600' } value={ '501-600' }> 500 - 600 </option>
                    <option key={ '600-700' } value={ '601-700' }> 600 - 700 </option>
                    <option key={ '700-800' } value={ '701-800' }> 700 - 800 </option>
                    <option key={ '800-900' } value={ '801-900' }> 800 - 900 </option>
                    <option key={ '900-1000' } value={ '901-1000' }> 900 - 1000 </option>
                    <option key={ '1000' } value={ '+1000' }> + 1000 </option> 
          </TextField><br/><br/>
          <Button type='submit'>Add Flat</Button>
      </Box>
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