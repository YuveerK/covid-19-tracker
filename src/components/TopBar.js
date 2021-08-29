import styled from "styled-components";
import NumberFormat from 'react-number-format';
import logo from "../assets/logo.svg";
import React, {useState, useEffect} from 'react'
import Chart from "./Chart";
import Table from "../components/Table"
import Cards from "./Card"

const TopBar = () => {
    const [countries, setCountries] = useState ([]);
    const [countryInfo, setCountryInfo]= useState ([]);
    let [data, setData] = useState ({});
    const [vaccineNum, setVaccineNum] = useState({})
    const [tableData, setTableData] = useState ([]);
    const [ctyCode, setCtyCode] = useState ("World Wide")
    const [image, setImage] = useState ("")
    let countryCode= ``;


//Get's table data    
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
    useEffect( ()=> {

        async function fetchData() {
            //fetches initial global data
                await fetch ("https://disease.sh/v3/covid-19/all")
                .then ((response) => response.json())
                .then ((data) => {
                    setCountryInfo(data)
                });   
                
                //fetches chart data
                await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=90`)
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    let chartData = buildChartData(data);
                    setData(chartData);
                  });
    
                  //Fetches vaccine data
                  await fetch ("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true")
                  .then ((response) => response.json())
                  .then ((data) => {
                    setVaccineNum(data[0].total)
                });
        }

        fetchData()
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

    const buildChartData = (data) => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
          if (lastDataPoint) {
            let newDataPoint = {
              x: date,
              y: data['cases'][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
          }
          lastDataPoint = data['cases'][date];
        }
        return chartData;
      };

      
      
//Runs api call based on value selected from list
    const onCountryChange = async (event) => {
         countryCode = event.target.value;
        const url = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
        
        await fetch (url)
        .then((response) => response.json())
        .then(data => {
            setCountryInfo(data)
            // setImage(data.countryInfo.flag)
        })
        

        if (countryCode === 'worldwide') {
            //Runs call to fetch chart data when option is selected
            try {
                const url2_2 =  `https://disease.sh/v3/covid-19/historical/all?lastdays=90`
    
            await fetch(url2_2)
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {    
                    let chartData = buildChartData(data)
                    setData(chartData);                
                  });
                  
            } catch (error) {
                alert('No hisorical chart data found, graph is populated with last dataset')
            }

        } else {

            //Runs call to fetch chart data when option is selected
            try {
                const url2 =  `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=90`
    
            await fetch(url2)
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {    
                    let chartData = buildChartData(data.timeline)
                    setData(chartData);                
                  });
                  
            } catch (error) {
                alert('No hisorical chart data found, graph is populated with last dataset')
            }
        }

  
       
        //Get's vaccine data when country is selected
        try {
            const url3 = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true' : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=1&fullData=true`

        await fetch(url3)
            .then((response) => response.json())
            .then ((data) => {
                countryCode === 'worldwide' ? setVaccineNum(data[0].total) : setVaccineNum(data.timeline[0].total)
            })
        } catch (error) { 

        }

        setCtyCode(countryCode)
        console.log(image)

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
                    <Left>
                        <HeadingContainer>
                            <Heading>
                                {ctyCode}
                            </Heading>
                            {/* <ImageHeading src={image} /> */}
                        </HeadingContainer>
                        
                        <CardContainer>
                            <Cards 
                                heading="Tests Conducted - As of Today"
                                currentNumber = {countryInfo.tests}
                                subHeading="" 
                            />
                            
                            <Cards 
                                heading="COVID-19 Cases - As Of Today"
                                currentNumber = {countryInfo.todayCases ? countryInfo.todayCases : "0" } 
                                totalNumber ={countryInfo.cases}
                                subHeading="total"                                
                            />
                            
                            <Cards 
                                heading="COVID-19 Deaths - Today"
                                currentNumber = {countryInfo.todayDeaths ? countryInfo.todayDeaths : "0"}
                                totalNumber ={countryInfo.deaths}
                                subHeading="total"                               
                            />        
                            
                            <Cards 
                                heading="COVID-19 Recovered Cases - Today"
                                currentNumber = {countryInfo.todayRecovered ? countryInfo.todayRecovered : "0"}
                                totalNumber ={countryInfo.recovered}
                                subHeading="total"                               
                            />        
                            
                            <Cards 
                                heading="Vaccines Administered"
                                currentNumber = {vaccineNum}                               
                            />        
                                               
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
        </Container>
        
   
    )
}


export const HeadingContainer=styled.div`
    
   
`;
export const Heading=styled.h1`
    
   
`;
export const ImageHeading=styled.img`
    
   
`;
export const TableContainer=styled.div`
    width: 100%;
    height: 400px;
    @media (max-width: 900px) {
        margin-top: 100px;
    }
   
`;

export const ChartContainer=styled.div`
    position:relative;
    width: 80%;
    margin:auto;
    
    height: 100%;
   
`;

export const Left=styled.div`
    width: 100%;
    height: 100%;
       
    margin-top: 160px;
    border-radius: 10px;

`;
export const Right=styled.div`
    flex: 0.2;
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
    position: fixed;
    z-index: 9999;
    top: 0;
    background-color: white;

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





export default TopBar
