import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from "react";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../firebase";


// @Params: type: "my-flats" | "all-flats" | "favorite-flats"
export default function UsersTable() {
    

    return (
        <TableContainer>
            <Table className="min-w-full divide-y divide-gray-200" aria-label="simple table">
                <TableHead className="bg-gray-50">
                    <TableRow>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Area size</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Rent price</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Has AC</TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Date available</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                    
                    
                        <TableRow key={row.id}>
                            <TableCell className="px-6 py-4 whitespace-nowrap">{row.city}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.areaSize}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.rentPrice}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.hasAc ? 'Yes' : 'No'}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap" >{row.dateAvailable}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}