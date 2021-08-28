import styled from "styled-components";
import {  Line } from 'react-chartjs-2'

const Chart = ({ data, casesType }) => {
 


    return (
      

            <Container>
                <GraphContainer>
                    <Line
                        data={{
                            datasets: [
                            {
                                label: 'Total Covid-19 Cases',
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                            ],

                            options: {
                                maintainAspectRatio: false,
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    },
                                    x: {
                                        beginAtZero: true
                                    }
                                }
                            }
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
    width: 70%;
    height: 300px;

`;
export default Chart
