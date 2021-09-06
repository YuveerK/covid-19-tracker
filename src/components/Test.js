import React, { useEffect, useState } from 'react'

const Test = () => {
    const [vacData, setVacData] = useState({})

    useEffect (() => {
        const getCountryData = async () => {
            const country_url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/za?lastdays=90&fullData=false`
                await fetch (country_url)
                .then ((response) => {
                    return response.json()
                })
                .then ((data) => {
                    try {
                        let chartData = buildChartData(data)
                        setVacData(chartData)
                    } catch (error) {
                        console.log(error)
                    }
                })
        }
        getCountryData()
    }, [])

    const buildChartData = (data) => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data.timeline) {
          if (lastDataPoint) {
            let newDataPoint = {
              x: date,
              y: data['timeline'][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
          }
          lastDataPoint = data['timeline'][date];
        }
        return chartData;
      };

    console.log(vacData)

    
    return (
        <div>
            
        </div>
    )
}

export default Test
