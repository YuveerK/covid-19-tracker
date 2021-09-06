import styled from "styled-components";
import CountUp from 'react-countup';
import React from 'react'

const Card = ({ icon, heading, currentNumber, totalNumber, subHeading, color, borderBottom}) => {
    return (
        <Cards borderBottom={borderBottom}>
            <Icon className={icon} color={color}></Icon>
            <Text>
                {heading}
            </Text>
            <Number>
            <CountUp separator= ' ' duration={1} end={currentNumber}/>
            </Number>
            <SubText>
            <CountUp separator= ' ' duration={1} end={totalNumber}/> total

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
    border-bottom:20px solid ${props => props.borderBottom} ;
    border-radius: 10px;
    padding: 20px;
    margin:20px;
    transition: 2s ease-in;

`;

export const Icon=styled.i`
    font-size: 3rem;  
    color:${props => props.color};  

`;
export const Text=styled.p`
    text-align: center;
    

`;


export const Number=styled.h1`
    text-align: center;
    font-size: 1.5rem;
    

`;


export const SubText=styled.p`
    text-align: center;
    

`;

export default Card
