import styled from "styled-components";
import logo from "../assets/logo.svg";
import React, {useState, useEffect} from 'react'
import Chart from "./Chart";
import Table from "../components/Table"
import Cards, { Icon } from "./Card"
import global from "../assets/globe.png"
import CountUp from "react-countup";
import DataTable from 'react-data-table-component';


const TopBar = () => {
    const [countries, setCountries] = useState ([]);
    const [countryInfo, setCountryInfo]= useState ([]);
    const [countryDetailedInfo, setCountryDetailedInfo]= useState ([]);
    let [data, setData] = useState ({});
    const [vaccineNum, setVaccineNum] = useState({})
    const [tableData, setTableData] = useState ([]);
    const [ctyCode, setCtyCode] = useState ("World Wide")
    const [image, setImage] = useState (`${global}`)
    const [countryLanguages, setCountryLanguages] = useState ([])
    const [countryBorders, setCountryBorders] = useState ([])
    const [errorMessage, setErrorMessage] = useState("")
    const [iso3Code, setIso3Code] = useState("")
    let countryCode= ``;
    let countryInfoDecider = false;
    const title = ""
    const row = 
//Get's table data    
useEffect (() => {
    const getTableData = async () => {
        fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
            setTableData(data)
            console.log(data)
        })
    }



    getTableData()
}, [])

useEffect (() => {
    const getCountryData = async () => {
        const country_url = `https://restcountries.eu/rest/v2/alpha?codes=${iso3Code}`
            await fetch (country_url)
            .then ((response) => {
                return response.json()
            })
            .then ((data) => {
                try {
                    let languages = data[0].languages
                    let borders = data [0].borders
                    setCountryLanguages(languages)
                    setCountryBorders(borders)
                    setCountryDetailedInfo (data)
                    console.log(data)
                    
                } catch (error) {
                    countryInfoDecider = true
                    setCountryLanguages([])
                    setCountryBorders([])
                    setCountryDetailedInfo ([])
                }
            })
    }
    getCountryData()
}, [iso3Code])



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
         setCtyCode(countryCode)


        if (countryCode === 'worldwide') {
            setImage (`${global}`)
            setCtyCode("World Wide")
            setCountryLanguages([])
            setCountryBorders([])
            setCountryDetailedInfo ([])
            await fetch ("https://disease.sh/v3/covid-19/all")
                .then ((response) => response.json())
                .then ((data) => {
                    setCountryInfo(data)
                }); 
        } else {
            const url= `https://disease.sh/v3/covid-19/countries/${countryCode}`
            await fetch (url)
            .then((response) => response.json())
            .then(data => {
                setCountryInfo(data)
                setImage(data.countryInfo.flag)
                setIso3Code(data.countryInfo.iso3)
                console.log(iso3Code)
            })

            
            
        }
        

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
                setData([])
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
    }



    return (
        <Container>
             
            <TitleContainer>
                        <Image src={logo} />
                    <Title>
                        
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
                            <HeadingContentContainer>
                                <Heading>
                                    {ctyCode}
                                </Heading>

                                
                                <ImageHeading src={image} />
                                {countryDetailedInfo.length === 0 && <ErrorMessage>No data found </ErrorMessage>}
                                {countryCode === 'worldwide' && <ErrorMessage>{errorMessage}</ErrorMessage>}
                                {countryDetailedInfo.length > 0 &&   <CountryHeading>Population</CountryHeading>}        
                                  
                                        <Heading>
                                            <CountUp separator= ',' duration={3} end={countryInfo.population}/> 
                                        </Heading>
                                    

                            <CountryInfoContainer>
                                <LeftCountryInfo>
                                {countryDetailedInfo.length > 0 && <CountryHeading>Native Name</CountryHeading>}        
                                    <Ul>
                                        {countryDetailedInfo.map ((name) => (
                                            <Li key={name}>{name.nativeName} </Li>
                                        ))}

                                    </Ul>
                                    
                                    {countryDetailedInfo.length > 0 && <CountryHeading>Capital</CountryHeading>}
                                    <Ul>
                                        {countryDetailedInfo.map ((name) => (
                                            <Li key={name}>{name.capital} </Li>
                                        ))}

                                    </Ul>
                                    
                                    {countryDetailedInfo.length > 0 && <CountryHeading>Region</CountryHeading>}
                                    <Ul>
                                        {countryDetailedInfo.map ((name) => (
                                            <Li key={name}>{name.region} </Li>
                                        ))}

                                    </Ul>
                                    
                                    {countryDetailedInfo.length > 0 && <CountryHeading>Currencies</CountryHeading>}
                                    <Ul>
                                        
                                        {countryDetailedInfo.map ((currency, index) => (
                                            <Li key={currency}>
                                                {currency.currencies[index].code}
                                                
                                             </Li>
                                        ))}
                                        {countryDetailedInfo.map ((currency, index) => (
                                            <Li key={currency}>
                                                {currency.currencies[index].name}
                                                
                                             </Li>
                                        ))}
                                        {countryDetailedInfo.map ((currency, index) => (
                                            <Li key={currency}>
                                                {currency.currencies[index].symbol}
                                                
                                             </Li>
                                        ))}

                                    </Ul>
                                    
                                   
                                </LeftCountryInfo>

                                <RightCountryInfo>
                                {countryLanguages.length > 0 && <CountryHeading>Native Name</CountryHeading>}
                                    <Ul>
                                       {countryInfoDecider === false 
                                       ? countryLanguages.map ((language) => (
                                            <Li key={language}>{language.name} </Li>          
                                            ))
                                       : <Li>""</Li>
                                        } 
                                    </Ul>
                                    
                                    {countryDetailedInfo.length > 0 && <CountryHeading>Demonym</CountryHeading>}
                                    <Ul>
                                        {countryDetailedInfo.map ((demonym) => (
                                            <Li key={demonym}>{demonym.demonym} </Li>          
                                            ))}
                                    </Ul>
                                    
                                    {countryDetailedInfo.length > 0 && <CountryHeading>Numeric Code</CountryHeading>}
                                    <Ul>
                                        {countryDetailedInfo.map ((numericCode, index) => (
                                            <Li key={numericCode}>+{numericCode.callingCodes[index]} </Li>          
                                            ))}
                                    </Ul>
                                </RightCountryInfo>
                            </CountryInfoContainer>                            

                            

                            
                            </HeadingContentContainer>
                        </HeadingContainer>

                        
                        
                        <CardContainer>
                            
                            <CardContentContainer>

                                <Cards 
                                    icon="fas fa-vials"
                                    heading="Tests Conducted - As of Today"
                                    currentNumber = {countryInfo.tests}
                                    subHeading="total" 
                                />
                                
                                <Cards 
                                    icon="fas fa-user-plus"
                                    heading="COVID-19 Cases - As Of Today"
                                    currentNumber = {countryInfo.todayCases ? countryInfo.todayCases : "0" } 
                                    totalNumber ={countryInfo.cases}
                                    subHeading="total"                                
                                />
                                
                                <Cards 
                                    icon="fas fa-heartbeat"
                                    heading="COVID-19 Deaths - Today"
                                    
                                    currentNumber = {countryInfo.todayDeaths ? countryInfo.todayDeaths : "0"}
                                    totalNumber ={countryInfo.deaths}
                                    subHeading="total"                               
                                />        
                                
                                <Cards 
                                    icon="fas fa-praying-hands"
                                    heading="COVID-19 Recovered Cases - Today"
                                    currentNumber = {countryInfo.todayRecovered ? countryInfo.todayRecovered : "0"}
                                    totalNumber ={countryInfo.recovered}
                                    subHeading="total"                               
                                />        
                                
                                <Cards 
                                    icon="fas fa-syringe"
                                    heading="Vaccines Administered"
                                    currentNumber = {vaccineNum} 
                                    subHeading="total"                              
                                />        
                            </CardContentContainer>
                                               
                        </CardContainer>

                        <ChartContainer>
                            <Chart data={data} errorMessage={data.length === 0 ? `No Timeline Data of ${ctyCode} to display` : ""}/>
                        </ChartContainer>

                    </Left>

                
                    <Right>
                        
                        
                        <TableContainer>
                            <CountryHeading> Data Table Summarising COVID-19 Statistics Globally </CountryHeading>

                            <TableContentContainer>
                                <Table tableData = {tableData} />
                            </TableContentContainer>

                        </TableContainer>
                    </Right>
        </Container>
        
   
    )
}

export const TableContentContainer=styled.div`
    width: 100%;
    overflow-y: scroll;

`;
export const Icons=styled.i`
    font-size: 1rem;  
    color:green; 
    position: absolute;
    bottom: 0;
    right: 20px;

`;

export const HeadingContainer=styled.div`
    width: 100%;
    display: flex;
    height: fit-content;
    align-items: center;
    justify-content: center;
    background-color: lightgrey;
    padding: 15px;
    flex-direction: column;
    box-shadow: 0px 0px 11px 3px #9d9d9d;      
     @media (max-width: 280px) {
          
      }
`;

export const CountryInfoContainer=styled.div`
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding: 20px;
      overflow-y: scroll;
      background-color: rgb(226, 226, 226);
      border-radius: 10px;


      @media (max-width: 560PX) {
          flex-direction: column;
      }
`;

export const LeftCountryInfo=styled.div`
        
         padding:0;
         
`;

export const CardContentContainer=styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 50px;
`;
export const RightCountryInfo=styled.div`
       
`;

export const ErrorMessage=styled.p`
    font-size: 2rem;
    color: red;
`;
export const CountryHeading=styled.h1`
    font-weight: 300 bold;
    font-size: 1rem;
    margin-top: 20px;
`;
export const Ul=styled.ul`
        
`;
export const Li=styled.li`
    list-style: none;
    padding-left: 20px;
`;
export const HeadingContentContainer=styled.div`
    width: 500px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: 0px 0px 11px 3px #9d9d9d;   
    border-radius: 10px;
    background-color: white;
    padding: 20px;

    @media (max-width: 280px) {
        width: 100%;
        flex-direction: column;
    }

    @media (max-width: 550px) {
            width: 100%;
            flex-direction: column;
        }


    img {
        width: 200px;
        height: 100%;
        object-fit: cover;
    }

   
`;
export const Heading=styled.h1`
    font-weight: 300;
   
`;
export const ImageHeading=styled.img`
    margin-top: 20px;
   
`;
export const TableContainer=styled.div`
    width: 80%;
    margin: auto;
    height: 400px;
    margin-top: 100px;
    overflow-y: scroll;
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
       
    margin-top: 120px;
    border-radius: 10px;
    @media (max-width: 540px) {
     margin-top: 150px;   
    }

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
    padding: 20px;
    position: fixed;
    z-index: 9999;
    top: 0;
    background-color: white;

    @media (max-width: 280px) {
        
    }

    @media (max-width: 540px) {
        
    }

    @media (max-width: 905px) {
        flex-direction: column;
    }
`;
export const Title=styled.h1`
    
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 280px) {
        
        display: none;
    }

    @media (max-width: 540px) {
        display: none;   
    }

    
`;
export const Image=styled.img`
    height: 70px;
    animation: rotation 20s infinite linear;
    margin-right: 40px;

    @media (max-width: 280px) {
        margin-right: 0;
        margin-bottom: 15px;
    }

    @media (max-width: 540px) {
        margin-right:0;
        margin-bottom: 15px;
    }

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
    width: 100%;
    

`;
export const Select=styled.select`
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 30px;
    

`;
export const Option=styled.option`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;

`;





export default TopBar
