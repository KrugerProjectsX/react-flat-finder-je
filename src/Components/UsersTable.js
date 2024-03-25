import * as React from 'react';
import Table from '@mui/material/Table';
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

    const [users, setUsers] = useState([]);

    const getData = async () => {
        const data = await getDocs(ref);
        const usersSet = []; // Conjunto para almacenar usuarios únicos

        // Iterar sobre los usuarios y agregarlos al conjunto
        for (const item of data.docs) {
            const search = query(refFlats, where("user", "==", item.id));
            const dataFlats = await getDocs(search);
            const userWithFlats = {...item.data(), id: item.id, flats: dataFlats.docs?.length};
            usersSet.push(userWithFlats);
        }

        setUsers(usersSet);
    };

    useEffect(() => {
        getData();
    }, []);


    return (
        <TableContainer>
            <Table className="min-w-full divide-y divide-gray-200" aria-label="simple table">
                <TableHead className="bg-gray-50">
                    <TableRow>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Last Name</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Email</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Birth Date</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">is Admin</TableCell>
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
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.role ==='admin' ? 'Yes' : 'No'}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.flats}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" ><Button variant="contained">Edit</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}