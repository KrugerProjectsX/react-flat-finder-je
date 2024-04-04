import Box from '@mui/material/Box';
import { Button, Switch, TextField, Typography } from '@mui/material';
import { addDoc, collection,  doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../Firebase";
import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";

export default function FlatForm({type, id}){
    const [flatLoaded, setFlatLoaded] = useState(false);
    const currentDate = new Date().toJSON().slice(0, 10);
    const [flat, setFlat] = useState(
        {
            city: '',
            streetName: '',
            streetNumber: 0,
            areaSize: 0,
            hasAc: false,
            yearBuilt: 0,
            rentPrice: 0,
            dateAvailable: currentDate
        }
    );
    const navigate = useNavigate();


    const date = new Date().toJSON().slice(0 , 10);
    const city = useRef('')
    const streetName = useRef('')
    const streetNumber = useRef(0)
    const areaSize = useRef(0)
    const hasAC = useRef(false)
    const yearBuilt = useRef(0)
    const rentPrice = useRef(0)
    const dateAvailable = useRef('')
    const ref = collection(db, "flats");
    let refFlat = null;
    console.log(id , type)
    if (id && type !== 'create') {
        refFlat = doc(db, "flats", id);
    } 
    const getFlatData = async () => {
        console.log(refFlat)
        const dataFlat = await getDoc(refFlat);
        const responseFlat = { ...dataFlat.data() };
        setFlat(responseFlat);
        setFlatLoaded(true);
    }
    const processData = async () => {
        if (type === 'update' || type === 'view') {
            await getFlatData();
        }else{
            setFlatLoaded(true)
        }
    }  
    const handleSubmit = async (e)=>{
        e.preventDefault();
        let flatSend = {
            city : city.current.value,
            streetName : streetName.current.value ,
            streetNumber : streetNumber.current.value , 
            areaSize : areaSize.current.value , 
            hasAC : hasAC.current.checked , 
            yearBuilt : yearBuilt.current.value , 
            rentPrice : rentPrice.current.value , 
            dateAvailable : dateAvailable.current.value , 
            user: JSON.parse (localStorage.getItem('user_logged'))
        }
        if (type === 'create') {
            await addDoc(ref, flatSend);
        }
        if(type === 'update'){
          await updateDoc(refFlat , flatSend)
        }

    }
    

    useEffect(() => {
        processData();
        
    },[]);

    return(
    <Box onSubmit={handleSubmit} sx={{marginLeft:'30%', width:'40%' ,  marginTop:'2.5%', textAlign: 'center'}} component={'form'}>
        {flatLoaded ? <>
            <Typography fontWeight={'bold'} component={'h2'}>Create Your Flat</Typography><br></br>
        <Box display={'flex'}>
        <TextField disabled={type === 'view'} label='City' defaultValue={flat.city}  inputRef={city} variant='outlined'/><br/><br/>
        <TextField disabled={type === 'view'} label='Street name' defaultValue={flat.streetName} inputRef={streetName}  variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <TextField disabled={type === 'view'} label='Street number' defaultValue={flat.streetNumber}  inputRef={streetNumber}  variant='outlined'/>
        <TextField disabled={type === 'view'} label='Area size' type='number' defaultValue={flat.areaSize} inputRef={areaSize}  variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <div>
      <Switch
      disabled={type === 'view'}
      defaultValue={flat.hasAc}
        inputRef={hasAC}
      />
      <label htmlFor='switch'>Has AC</label>
    </div>
        <TextField defaultValue={flat.yearBuilt}  disabled={type === 'view'} label='Year built' type='number' inputProps={{min: 1900 , max:2050}} inputRef={yearBuilt} variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <TextField defaultValue={flat.rentPrice} disabled={type === 'view'} label='Rent price' type='number' inputRef={rentPrice}  variant='outlined'/>
        <TextField disabled={type === 'view'} defaultValue={flat.dateAvailable}  type='date' label='Date available' defaultValue={date} inputRef={dateAvailable}  variant='outlined'/>
        </Box><br/><br/>
        { type !=='view' && <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Flat
                </Button> } 
                {/*TODO: Add the update button*/}
        </>
        : <p>Loading...</p>
        }
    </Box>)
}
