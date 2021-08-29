import styled from "styled-components";
import Numeral from 'react-numeral';

import React from 'react'

const Card = ({ heading, currentNumber, totalNumber, subHeading }) => {
    return (
        <Cards>
            <Text>
                {heading}
            </Text>
            <Number>
                <Numeral
                        value={currentNumber}
                        format={"0,0"}
                    /> 
            </Number>
            <SubText>
                <Numeral
                        value={totalNumber}
                        format={"0,0"}
                    /> {subHeading}
            </SubText>
        </Cards>
    )
}

export const Cards=styled.div`
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    box-shadow: 0px 0px 11px 3px #9d9d9d;   
    border-radius: 10px;
    padding: 20px;
    margin:20px;
    

`;

export const Text=styled.p`
    text-align: center;
    

`;


export const Number=styled.h1`
    
    

`;


export const SubText=styled.p`
    
    

`;

export default Card
