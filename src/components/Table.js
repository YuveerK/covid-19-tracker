import styled from "styled-components";

import React, { useState, useEffect } from 'react'


const Table = ({tableData}) => {


 
    return (
        <TableMain cellSpacing="0">
            <Tr>
                <Th>Country</Th>
                <Th>Cases</Th>
                
            </Tr>
          
                {
                    tableData.map((item) => (
                        <Tr key={item.countryInfo.id}>
                            <Td>{item.country}</Td>
                            <Td>{item.cases}</Td>                                
                        </Tr>
                    ))
                }
               
           
            
        </TableMain>
    )
}

export const TableMain = styled.table `
    width: 100%;

    @media (max-width: 900px) {
        margin-top: 80px;
    }
    
`;
export const Tr = styled.tr `
    width: 100%;


    :nth-child(even) {
        background-color: lightgrey;
    }
`;
export const Th = styled.th `
    text-align: left;
    background-color: black;
    color: white;
    padding: 20px;
`;
export const Td = styled.td `
    padding: 15px;
`;
export default Table
