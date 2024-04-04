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
import Button from '@mui/material/Button';
import { useState } from "react"
import { useEffect } from "react";
import { db } from "../Firebase";
import { collection ,  getDocs , query, where , addDoc, doc , getDoc , deleteDoc } from "@firebase/firestore";









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
  const refFav = collection(db , 'favorites')
const userId= JSON.parse(localStorage.getItem('user_logged'))
const [flats , setFlats] = useState([])
const [city , setCity] = useState('') ; 
const [rentPrice , setRentPrice] = useState(0) ; 
const [areaSize , setAreaSize] = useState(0) ;
const [flag, setFlag ] = useState(false); 



const getData = async () =>{ 
    const ref = collection(db , 'flats')
    let arrayWhere = []

    if (type === 'my-flats'){
        const search = query(ref , where('user' , '==', userId ))
        const data = await getDocs(search)
        const forRowsMy = data.docs.map((item)=>{
            return {...item.data() , id: item.id}
        })
        setFlats(forRowsMy)
    }
    if(type === 'favorite-flats'){
      const search = query(refFav, where('userId' , '==' , userId))
      const data = await getDocs(search) ; 
      const allFlats = [] ; 
      for (const item of data.docs){
        const refFlat = doc(db, 'flats' , item.data().flatId)
        const dataFlat = await getDoc(refFlat) ; 
        allFlats.push({...dataFlat.data() , id: dataFlat.id , favorite: item.id})
      }
      setFlats(allFlats)

    }
    if(type === 'all-flats'){
      if(city){
        arrayWhere.push(where('city', '==' , city))
    }
    if(areaSize){
        let settings = areaSize.split('-')
            arrayWhere.push(where('areaSize' , '>=' , parseInt(settings[0])))
            arrayWhere.push(where('areaSize', '<=', parseInt(settings[1]))); 
            console.log(arrayWhere)
    }
      let searchFlats = query(ref , ...arrayWhere) ; 
      const results = await getDocs(searchFlats);
      const allFlats = []
      for (const item of results.docs){
        const search = query(refFav , where('userId' , '==' , userId), where('flatId' , '==', item.id))
        const dataFav = await getDocs(search)
        let favorite = false 
        
        if(dataFav.docs.length > 0 ){
          favorite = dataFav.docs[0].id;
        }
        const flatWhitFav = {...item.data() , id: item.id , favorite: favorite}
        allFlats.push(flatWhitFav)
        

      }

      setFlats(allFlats)
   
    
    }


    
}
const addFavorite = async (id) =>{
  console.log(userId , id)
  const data = {
    userId : userId , 
    flatId : id
  }
  await addDoc(refFav, data)
  setFlag(!flag)
}
 const removeFavorite = async (id) =>{
  const refRemoveFav = doc(db , 'favorites' , id)
  await deleteDoc(refRemoveFav) ;
  setFlag(!flag)
 }

    useEffect(()=>{getData()}, [city , areaSize])
    useEffect(() => {
      getData();
  }, [flag]);



  
  
  return (
    <>
      { type === 'all-flats' && <Box textAlign={'center'} sx={{ width: '60%', marginLeft: '20%', marginTop: '50px' }} component={'form'} boxShadow={3} p={4} borderRadius={4}>
  <TextField 
    label='City'   
    variant='outlined' 
    value={city}
    onChange={(e)=> setCity(e.target.value)}
    fullWidth
    sx={{ marginBottom: '20px' }}
  />
  <TextField 
    select 
    label={ 'Area Size Range' } 
    variant="outlined" 
    SelectProps={{ native: true }} 
    value={areaSize}
    onChange={(e)=> setAreaSize(e.target.value)}
    fullWidth
    sx={{ marginBottom: '20px' }}
  >
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
  </TextField>
  <TextField 
    select 
    label={ 'Rent Price Range' } 
    variant="outlined" 
    SelectProps={{ native: true }} 
    value={rentPrice}
    onChange={(e)=> setRentPrice(e.target.value)}
    fullWidth
    sx={{ marginBottom: '20px' }}
  >
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
  </TextField>
</Box> } <br/><br/><br/>
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
              <StyledTableCell align="center">View</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flats.map((row) => (
              <StyledTableRow key={row.id}>
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
                {type ==='all-flats' && <StyledTableCell align="center">
                  {!row.favorite && <Button variant="outlined" onClick={()=>addFavorite(row.id)}  >Add Favorite</Button>}
                  {row.favorite && <Button variant="outlined" onClick={()=>removeFavorite(row.favorite)}  >Remove Favorite</Button>}
                  </StyledTableCell> }
                {type ==='favorite-flats' && <StyledTableCell align="center">
                  {<Button variant="outlined" onClick={()=>removeFavorite(row.id)}  >Remove Favorite</Button>}
                </StyledTableCell> }
                <StyledTableCell align="center"><Button variant="contained" href={`/flat/${row.id}`} >View</Button>
                                {type === 'my-flats' && <Button href={`/flats/edit/${row.id}`} >Edit</Button>}</StyledTableCell>
          
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export { TableFlats } ; 