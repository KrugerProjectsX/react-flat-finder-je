import Box from '@mui/material/Box';
import { Button, Switch, TextField, Typography } from '@mui/material';
import { useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from "../Firebase";

const FlatForm = () =>{
    
    const flatsRef = collection(db , 'flats')



    const date = new Date().toJSON().slice(0 , 10);
    const city = useRef('')
    const streetName = useRef('')
    const streetNumber = useRef('')
    const areaSize = useRef(0)
    const hasAC = useRef(false)
    const yearBuilt = useRef(0)
    const rentPrice = useRef(0)
    const dateAvailable = useRef('')

    const handleSubmit = async (e)=>{
        e.preventDefault();
        await addDoc(flatsRef , {
            city : city.current.value,
            streetName : streetName.current.value ,
            streetNumber : streetNumber.current.value , 
            areaSize : areaSize.current.value , 
            hasAC : hasAC.current.checked , 
            yearBuilt : yearBuilt.current.value , 
            rentPrice : rentPrice.current.value , 
            dateAvailable : dateAvailable.current.value , 
            user: JSON.parse (localStorage.getItem('user_logged'))
        })

    }

    return(
        <Box className="mx-auto mt-10 sm:w-2/5 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="font-bold text-center mb-4">Create Your Flat</h2>
        <div className="flex mb-4">
          <TextField label="City" inputRef={city} variant="outlined" className="w-1/2 mr-2" />
          <TextField label="Street name" inputRef={streetName} variant="outlined" className="w-1/2" />
        </div>
        <div className="flex mb-4">
          <TextField label="Street number" inputRef={streetNumber} variant="outlined" className="w-1/2 mr-2" />
          <TextField label="Area size" type="number" inputRef={areaSize} variant="outlined" className="w-1/2" />
        </div>
        <div className="flex mb-4 items-center">
          <div>
            <Switch inputRef={hasAC} />
            <label htmlFor="switch" className="ml-2">Has AC</label>
          </div>
          <TextField label="Year built" type="number" inputProps={{min: 1900, max: 2050}} inputRef={yearBuilt} variant="outlined" className="w-1/2 ml-4" />
        </div>
        <div className="flex mb-4">
          <TextField label="Rent price" type="number" inputRef={rentPrice} variant="outlined" className="w-1/2 mr-2" />
          <TextField type="date" label="Date available" defaultValue={date} inputRef={dateAvailable} variant="outlined" className="w-1/2" />
        </div>
        <Button type="submit" className="w-full">Add Flat</Button>
      </Box>
      

      )
}

export {FlatForm} ;