import styled from "styled-components";
import {  Line, Bar } from 'react-chartjs-2'
import numeral from "numeral";
import { ErrorMessage } from "./TopBar";
const Chart = ({ data, errorMessage }) => {
 
    const state = {
        
        datasets: [
          {
            label: 'Daily New: Covid-19 Cases',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(0,0,0,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: data
          }
        ]
      }

      const options = {
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 2,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (tooltipItem, data) {
              return numeral(tooltipItem.value).format("+0,0");
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return numeral(value).format("0a");
                },
              },
            },
          ],
        },
      };

    return (
      

            <Container>
                <GraphContainer>
                  <ErrorMessage>{errorMessage}</ErrorMessage>
                  {data?.length > 0 && (
                    <Line height = "100%"
                       data={state}
                        options={options}                       
                    />
                  )}
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
    box-shadow: 0px 0px 11px 3px #9d9d9d;    
    border-radius: 15px;  

`;

export const GraphContainer = styled.div `
    position: relative;
    width: 100%;
    height: 500px;
`;

export default Chart
