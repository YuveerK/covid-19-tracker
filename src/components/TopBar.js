import styled from "styled-components";
import NumberFormat from 'react-number-format';
import logo from "../assets/logo.svg";
import React, {useState, useEffect} from 'react'
import Chart from "./Chart";
import Numeral from 'react-numeral';
import Table from "../components/Table"
const TopBar = () => {
    let number = 0;
    const [countries, setCountries] = useState ([]);
    const [countryInfo, setCountryInfo]= useState ([]);
    let [data, setData] = useState ({});
    const [vaccineNum, setVaccineNum] = useState({})
//Calculates new daily cases


const [tableData, setTableData] = useState ([]);

useEffect (() => {
    const getTableData = async () => {
        fetch("https://disease.sh/v3/covid-19/countries?sort=cases")
        .then((response) => response.json())
        .then((data) => {
            setTableData(data)
            
        })


    }
    getTableData()
}, [])



//Loads initial world data
    useEffect(async ()=> {

        //fetches initial global data
            await fetch ("https://disease.sh/v3/covid-19/all")
            .then ((response) => response.json())
            .then ((data) => {
                setCountryInfo(data)
            });   
            
            //fetches chart data
            await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=120`)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                setData(data.cases);
              });

              await fetch ("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true")
              .then ((response) => response.json())
              .then ((data) => {
                setVaccineNum(data[0].total)
                
            });

            
    }, [])
    


    //populates dropdown list
    useEffect (() => {
        const getCountriesData = async () => {
            await fetch ("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map ((country)=> (
                    {
                        name: country.country
                    }
                ))
                
                setCountries(countries)
                
            })
        }
        getCountriesData();
    }, [])


//Runs api call based on value selected from list
    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
        

        await fetch (url)
        .then((response) => response.json())
        .then(data => {
            setCountryInfo(data)
          
        })

        try {
            const url2 = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=120' : `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`

        await fetch(url2)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                countryCode === 'worldwide' ? setData (data.cases) : setData(data.timeline.cases)
              });

              
        } catch (error) {
            
            alert('No hisorical chart data found, graph is populated with last dataset')

        }
  
       
        try {
            const url3 = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true' : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=1&fullData=true`

        await fetch(url3)
            .then((response) => response.json())
            .then ((data) => {

                countryCode === 'worldwide' ? setVaccineNum(data[0].total) : setVaccineNum(data.timeline[0].total)
               
                
            })

              
        } catch (error) {
            
            
        

        }
    }



    return (
        <Container>
            <TitleContainer>
                    <Title>
                        <Image src={logo} />
                        
                        COVID-19 Tracker
                    </Title>

                    <Select onChange={onCountryChange}>
                        <Option value="worldwide">World Wide</Option>
                        {countries.map((country)=> (
                            <Option value={country.name}>{country.name}</Option>
                        ))}
                    </Select>
                </TitleContainer>

                <ContentContainer>
                    <Left>
                        
                        <CardContainer>
                            <Card>
                                <Text>
                                    Tests Conducted - as of Today
                                </Text>


                                
                                <Number>
                                    <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.tests}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    />

                                    
                                </Number>

                                
                            </Card>
                            <Card>
                                <Text>
                                    COVID-19 Cases - Today
                                </Text>


                                
                                <Number>
                                    <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.todayCases}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    />

                                    
                                </Number>

                                <SubText>
                                <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.cases}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    /> total
                                </SubText>
                            </Card>
                            <Card>
                                <Text>
                                    COVID-19 Deaths - Today
                                </Text>

                                <Number>
                                <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.todayDeaths}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    />
                                </Number>

                                <SubText>
                                <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.deaths}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    /> Total

                                    
                                </SubText>
                            </Card>
                            <Card>
                                <Text>
                                    COVID-19 Recovered Cases - Today
                                </Text>

                                <Number>
                                <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.todayRecovered}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    />
                                </Number>

                                <SubText>
                                <NumberFormat thousandsGroupStyle="thousand"
                                            value={countryInfo.recovered}
                                            prefix=""
                                            decimalSeparator="."
                                            displayType="text"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={true}
                                            fixedDecimalScale={false}
                                            allowEmptyFormatting={false}
                                            suffix="" 
                                            
                                    /> total
                                </SubText>
                            </Card>
                            
                            <Card>
                                <Text>
                                    Vaccines administered
                                </Text>

                                <Number>
                                            <Numeral
                                            value={vaccineNum}
                                            format={"0,0"}
                                        />
                                </Number>                       
                            </Card>                   
                        </CardContainer>

                        <ChartContainer>
                            <Chart data={data}/>
                        </ChartContainer>

                    </Left>

                    <Right>
                        <TableContainer>
                            <Table tableData ={tableData} />
                        </TableContainer>
                    </Right>
                </ContentContainer>
        </Container>
        
   
    )
}


export const TableContainer=styled.div`
    width: 100%;
    height: 400px;
    @media (max-width: 900px) {
        margin-top: 100px;
    }
   
`;

export const ChartContainer=styled.div`
    position:relative;
    width: 100%;
    margin:auto;
    background-color: yellow;
    height: 100%;
   
`;
export const ContentContainer=styled.div`
    width: 100%;
    height: fit-content;
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
    }
   
`;
export const Left=styled.div`
    flex:0.7;
    height: 100%;
`;
export const Right=styled.div`
    flex: 0.3;
    max-height: 600px;
    overflow-y: scroll;
    @media (max-width: 900px) {
        margin-top: 80px;
    }
`;
export const TitleContainer=styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 50px;
    padding: 20px;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`;
export const Title=styled.h1`
    
    display: flex;
    align-items: center;
    justify-content: center;
`;
export const Image=styled.img`
    height: 100px;
    animation: rotation 20s infinite linear;
    margin-right: 40px;

        @keyframes rotation {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(359deg);
            }
        }
`;
export const Container=styled.div`
    
    
    width: 100%;
    height: fit-content;
    
    

`;

export const CardContainer=styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    

`;
export const Select=styled.select`
    display: flex;
    align-items: center;
    justify-content: space-around;
    

`;
export const Option=styled.option`
    display: flex;
    align-items: center;
    justify-content: space-around;
    

`;

export const Card=styled.div`
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

export default TopBar
