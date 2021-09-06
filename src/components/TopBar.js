import styled from "styled-components";
import logo from "../assets/logo.svg";
import React, {useState, useEffect} from 'react'
import Chart from "./Chart";
import Table from "../components/Table"
import Cards, { Icon } from "./Card"
import global from "../assets/globe.png"
import CountUp from "react-countup";
import DataTable from 'react-data-table-component';
import Map from "./Map";
import pic from "../assets/countrybg.jpg"



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
    const [weather, setWeather] = useState ([])
    const [temperature, setTemperature] = useState ([])
    const [weatherDescription, setWeatherDescription] = useState ([])
    const [weatherInformation, setWeatherInformation] = useState ([])
    const [iso3Code, setIso3Code] = useState("")
    const [cord, setCord] = useState({});
    let countryCode= ``;
    let countryInfoDecider = false;
    const title = ""
    const row = 


//Get's table data for the table    
useEffect (() => {
    const getTableData = async () => {
        fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
            setTableData(data)
        })
    }
    getTableData()
}, [])

//Use effect that sends a request everytime the country changes in the drop down menu.
//The iso3 code is cast as a variable into the link.
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
                    setCountryDetailedInfo (data)
                    
                } catch (error) {
                    countryInfoDecider = true
                    setCountryLanguages([])
                    setCountryDetailedInfo ([])
                }
            })
    }
    getCountryData()
}, [iso3Code])


useEffect (() => {
    const getWeather = async () => {
        const country_url = `https://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.long}&units=metric&appid=9593eca72eb8c1dbf309188937a446d7`
            await fetch (country_url)
            .then ((response) => {
                return response.json()
            })
            .then ((data) => {
                try {
                  setWeather(data)
                  setTemperature(data.main)
                  setWeatherDescription(data.weather[0])
                    
                } catch (error) {
                    setWeather([])
                    setTemperature([])
                    setWeatherDescription([])
                }
            })
    }
    getWeather()
}, [cord])




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
                        name: country.country,
                        isocode: country.countryInfo.iso3
                    }
                ))
                setCountries(countries)
            })
        }
        getCountriesData();
    }, [])


    //function that calculates the daily new cases by taking current date and subtracting the previous dates cases.
    //This data is then passed onto the graph.
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
            setCountryDetailedInfo ([])
            setWeather([])
            setTemperature({})
            await fetch ("https://disease.sh/v3/covid-19/all")
                .then ((response) => response.json())
                .then ((data) => {
                    setCountryInfo(data)
                }); 
        } else {
            const url= `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true&strict=true`
            await fetch (url)
            .then((response) => response.json())
            .then(data => {
                console.log(data)
                setCountryInfo(data)
                setImage(data.countryInfo.flag)
                setIso3Code(data.countryInfo.iso3)
                setCord(data.countryInfo)
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
        //Get's vaccine data when country is select
        try {
            const url3 = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true' : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=1&fullData=true`

        await fetch(url3)
            .then((response) => response.json())
            .then ((data) => {
                countryCode === 'worldwide' ? setVaccineNum(data[0].total) : setVaccineNum(data.timeline[0].total)
            })
        } catch (error) { 
            setVaccineNum({})
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
                            <Option value={country.isocode}>{country.name}</Option>
                        ))}
                    </Select>
            </TitleContainer>            
                    <Left>
                        <HeadingContainer>
                                <HeadingContentContainer>
                                        <Heading>
                                            {countryInfo.country}
                                        </Heading>

                                        
                                        <ImageHeading src={image} />
                                        
                                        <CountryHeading>Population</CountryHeading>        
                                            <Heading>
                                                <CountUp separator= ' ' duration={3} end={countryInfo.population}/> 
                                            </Heading>

                                            { Object.keys(weather).length > 0 &&
                                        <WeatherContainer>                                                                                        
                                            {weatherDescription &&
                                            <WeatherImageContainer>
                                                <WeatherImageIcon src={`https://openweathermap.org/img/wn/${weatherDescription.icon}@2x.png`} />
                                            </WeatherImageContainer>
                                            }
                                            {weatherDescription &&
                                            <Heading>{`${weatherDescription.description}`} </Heading>
                                            }

                                            {temperature &&
                                                <Heading>{`${temperature.temp}`} °C</Heading>
                                            }
                                        </WeatherContainer>
}
                                        
                                        


                                    
                                    {countryDetailedInfo.length> 0 &&
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
                                            {countryLanguages.length > 0 && <CountryHeading>Languages</CountryHeading>}
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
                                                
                                                {countryDetailedInfo.length > 0 && <CountryHeading>Time Zone</CountryHeading>}
                                                <Ul>
                                                    {countryDetailedInfo.map ((timeZone, index) => (
                                                        <Li key={timeZone}>{timeZone.timezones[index]} </Li>          
                                                        ))}
                                                </Ul>
                                        </RightCountryInfo>
                                    </CountryInfoContainer>   
                                    }                         
                            </HeadingContentContainer>
                        </HeadingContainer>

                        <CardContainer>
                            
                            <CardContentContainer>

                                <Cards 
                                    icon="fas fa-vials"
                                    heading="Tests Conducted - As of Today"
                                    currentNumber = {countryInfo.tests}
                                    subHeading="total"
                                    color="darkgrey" 
                                    borderBottom="darkgrey"    
                                />
                                
                                <Cards 
                                    icon="fas fa-user-plus"
                                    heading="COVID-19 Cases - As Of Today"
                                    currentNumber = {countryInfo.todayCases ? countryInfo.todayCases : "0" } 
                                    totalNumber ={countryInfo.cases}
                                    subHeading="total"   
                                    color="orange" 
                                    borderBottom="orange"                                
                                />
                                
                                <Cards 
                                    icon="fas fa-heartbeat"
                                    heading="COVID-19 Deaths - Today"
                                    currentNumber = {countryInfo.todayDeaths ? countryInfo.todayDeaths : "0"}
                                    totalNumber ={countryInfo.deaths}
                                    subHeading="total"
                                    color="red" 
                                    borderBottom="red"                                
                                />        
                                
                                <Cards 
                                    icon="fas fa-praying-hands"
                                    heading="COVID-19 Recovered Cases - Today"
                                    currentNumber = {countryInfo.todayRecovered ? countryInfo.todayRecovered : "0"}
                                    totalNumber ={countryInfo.recovered}
                                    subHeading="total"     
                                    color="green" 
                                    borderBottom="green"                         
                                />        
                                
                                <Cards 
                                    icon="fas fa-syringe"
                                    heading="Vaccines Administered"
                                    currentNumber = {vaccineNum} 
                                    subHeading="total"  
                                    color="#03f4fc"   
                                    borderBottom="#03f4fc"                         
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
                    
                    {/* <Map data={tableData}/> */}
        </Container>

        
   
    )
}

export const WeatherImageContainer=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width:80px;
    height:fit-content;    

`;
export const WeatherImageIcon=styled.img`
    

`;
export const WeatherContainer=styled.div`
    
    color: black;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: 0px 0px 11px 3px #9d9d9d;  
    padding: 20px;
    margin-top: 30px;
    border-radius: 10px;

`;

export const TableContentContainer=styled.div`
    width: 100%;
    overflow-y: scroll;
    
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &::-webkit-scrollbar {
    display: none;
}

`;


export const Icons=styled.i`
    font-size: 1rem;  
    color:green; 
    position: absolute;
    bottom: 0;
    right: 20px;

`;

export const HeadingContainer=styled.div`
  background-size: cover;
    width: 100%;
    display: flex;
    height: fit-content;
    align-items: center;
    justify-content: center;
    background-color: lightgrey;
    padding: 15px;
    flex-direction: column;
    background-image: url("https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?cs=srgb&dl=pexels-pixabay-41949.jpg&fm=jpg");
     
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
    background-size: cover;
    width: 500px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
    width: 99%;
    margin: auto;
    height: fit-content;
    margin-top: 100px;
    box-shadow: 0px 0px 11px 3px #9d9d9d;   
    border-radius: 10px;
    padding: 15px;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    
    &::-webkit-scrollbar {
    display: none;
    }
    
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
    max-height: fit-content;
    padding: 20px;
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
