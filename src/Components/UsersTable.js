import * as React from 'react';
import Table from '@mui/material/Table';
import { Box} from "@mui/system";
import TextField from "@mui/material/TextField";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from "react";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../src/Firebase";
import Button from '@mui/material/Button';




// @Params: type: "my-flats" | "all-flats" | "favorite-flats"
export default function UsersTable() {
    const ref = collection(db, "users");
    const refFlats = collection(db, "flats");
    const [userType , setUserType] = useState('') ; 
    const [flatsCounter , setFlatsCounter] = useState(0) ; 
    const [age , setAge] = useState(0) ;
    

    const [users, setUsers] = useState([]);

    const getData = async () => {
        let arrayWhere = []
       
       
        if(userType){
            arrayWhere.push(where('role', '==' , userType))
        }

        let searchUsers = query(ref , ...arrayWhere) ; 
        
        
        const data = await getDocs(searchUsers);
        const usersSet = [];
         // Conjunto para almacenar usuarios únicos



        // Iterar sobre los usuarios y agregarlos al conjunto
        for (const item of data.docs) {
            const search = query(refFlats, where("user", "==", item.id));
            const dataFlats = await getDocs(search);
            if(flatsCounter){
                const flatsValue= flatsCounter.split('-');
                if(flatsValue.length > 1){
                    const min = flatsValue[0]
                    const max = flatsValue[1]
                    if(dataFlats.docs?.length < min || dataFlats.docs?.length > max){
                        continue;
                    }
                }else{
                    if(flatsValue[0] ==='61+'){
                        if(dataFlats.docs?.length < 61){
                            continue
                        }

                    }
                }
            }
            const userWithFlats = {...item.data(), id: item.id, flats: dataFlats.docs?.length};
            usersSet.push(userWithFlats);
        }
        setUsers(usersSet);
        
    };

    useEffect(() => {
        getData();
    }, [userType , flatsCounter]);


    return (
        <>
        <Box textAlign={'center'} sx={{width: '60%' , marginLeft: '20%'}} component={'form'}>
        <TextField select label={ 'User Type' } 
          variant="outlined" 
          SelectProps={ { native: true } } 
          value={userType}
          onChange={(e)=> setUserType(e.target.value)}>
                    <option key={ 'none' } value={ '' }></option>
                    <option key={ '100-200' } value={ 'admin' }> Admin </option>
                    <option key={ '200-300' } value={ 'landlord' }> Landlord </option>
                    <option key={ '300-400' } value={ 'render' }>  Renter </option> 
          </TextField><br/><br/>
          <TextField select label={ 'Flats Count' } 
          variant="outlined" 
          SelectProps={ { native: true } } 
          value={flatsCounter}
          onChange={(e)=> setFlatsCounter(e.target.value)}>
                    <option key={ 'none' } value={ '' }></option>
                    <option key={ '100-200' } value={ '0-5' }> 0-5</option>
                    <option key={ '200-300' } value={ '6-10' }> 6-10 </option>
                    <option key={ '300-400' } value={ '11-30' }>  11-30 </option>
                    <option key={ '400-500' } value={ '30-61' }> 30 - 61 </option>
                    <option key={ '1000' } value={ '61+' }> 61+ </option> 
          </TextField><br/><br/>
          <TextField select label={ 'Area Size Range' } 
          variant="outlined" 
          SelectProps={ { native: true } } 
          value={age}
          onChange={(e)=> setAge(e.target.value)}>
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
      </Box>
        <TableContainer>
            <Table className="min-w-full divide-y divide-gray-200" aria-label="simple table">
                <TableHead className="bg-gray-50">
                    <TableRow>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Last Name</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Email</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Birth Date</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Role</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Flats Count</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Update info</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {users.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="px-6 py-4 whitespace-nowrap">{row.firstName}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.lastName}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.email}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.birthday}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.role}</TableCell>

                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.flats}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" ><Button href={`update-profile/${row.id}`} variant="contained">Edit</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>    
            </Table>
        </TableContainer>
        </>
    );
}