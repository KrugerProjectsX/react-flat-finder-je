import Box from '@mui/material/Box';
import { Button, Switch, TextField, Typography } from '@mui/material';
import { useRef } from 'react';

const FlatForm = () =>{

    const date = new Date().toJSON().slice(0 , 10);
    const city = useRef('')
    const streetName = useRef('')
    const streetNumber = useRef(0)
    const areaSize = useRef(0)
    const hasAC = useRef(false)
    const yearBuilt = useRef(0)
    const rentPrice = useRef(0)
    const dateAvailable = useRef(0)

    const handleSubmit =(e)=>{
        e.preventDefault();

    }

    return(
    <Box onSubmit={handleSubmit} sx={{marginLeft:'30%', width:'40%' ,  marginTop:'2.5%', textAlign: 'center'}} component={'form'}>
        <Typography fontWeight={'bold'} component={'h2'}>Create Your Flat</Typography><br></br>
        <Box display={'flex'}>
        <TextField label='City' inputRef={city} variant='outlined'/><br/><br/>
        <TextField label='Street name' inputRef={streetName}  variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <TextField label='Street number' inputRef={streetNumber}  variant='outlined'/>
        <TextField label='Area size' type='number' inputRef={areaSize}  variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <Box>
      <Switch
        control={<Switch checked={hasAC}/>}
        label="Has AC"
      />
      <label>Has AC</label>
    </Box>
        <TextField label='Year built' type='number' inputProps={{min: 1900 , max:2050}} inputRef={yearBuilt} variant='outlined'/>
        </Box><br/><br/>
        <Box display={'flex'}>
        <TextField label='Rent price' type='number' inputRef={rentPrice}  variant='outlined'/>
        <TextField  type='date' label='Date available' defaultValue={date} inputRef={dateAvailable}  variant='outlined'/>
        </Box><br/><br/>
        <Button type='submit'>Add Flat</Button>
    </Box>)
}

export {FlatForm} ;