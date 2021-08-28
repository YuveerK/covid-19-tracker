import styled from "styled-components";
import {  Line, Bar } from 'react-chartjs-2'

const Chart = ({ data, casesType }) => {
 
    const state = {
        
        datasets: [
          {
            label: 'Covid-19 Total Cases',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(0,0,0,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: data
          }
        ]
      }

    return (
      

            <Container>
                <GraphContainer>
                    <Line height = "100%"
                       data={state}
                       options={{
                         title:{
                           display:true,
                           text:'Average Rainfall per month',
                           fontSize:20
                         },
                         legend:{
                           display:true,
                           position:'right'
                         },
                         scale:{
                           y: {
                            beginAtZero: true,
                           },
                           x: {
                            beginAtZero: true,
                           }
                         },
                         maintainAspectRatio : false
                       }}
                        
                        
                    />
                </GraphContainer>
            </Container>
        
    )
}

export const Container = styled.div `
    position: relative;
    width: 100%;
    margin:auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 100px;

`;

export const GraphContainer = styled.div `
    position: relative;
    width: 100%;
    height: 400px;

`;
export default Chart
