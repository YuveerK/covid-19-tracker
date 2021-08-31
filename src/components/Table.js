import styled from "styled-components";
import Numeral from "react-numeral";
import DataTable from 'react-data-table-component';


const Table = ({tableData}) => {
    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Active',
            selector: row => row.active,
            sortable: true,
        },
        {
            name: 'Cases',
            selector: row => row.cases,
            sortable: true,
        },
        {
            name: 'Cases Active Per 1 Million',
            selector: row => row.casesPerOneMillion,
            sortable: true,
        },
        {
            name: 'Continent',
            selector: row => row.continent,
            sortable: true,
        },
        {
            name: 'Critical',
            selector: row => row.critical,
            sortable: true,
        },
        {
            name: 'Critical Per One Million',
            selector: row => row.criticalPerOneMillion,
            sortable: true,
        },
        {
            name: 'Deaths',
            selector: row => row.deaths,
            sortable: true,
        },
        {
            name: 'Deaths Per 1 Million',
            selector: row => row.deathsPerOneMillion,
            sortable: true,
        },
        {
            name: 'One Case Per People',
            selector: row => row.oneCasePerPeople,
            sortable: true,
        },
        {
            name: 'One Death Per People',
            selector: row => row.oneDeathPerPeopl,
            sortable: true,
        },
        {
            name: 'One Test Per People',
            selector: row => row.oneTestPerPeople,
            sortable: true,
        },
        {
            name: 'Population',
            selector: row => row.population,
            sortable: true,
        },
        {
            name: 'Recovered',
            selector: row => row.recovered,
            sortable: true,
        },
        {
            name: 'Recovered Per One Million',
            selector: row => row.recoveredPerOneMillion,
            sortable: true,
        },
        {
            name: 'Tests',
            selector: row => row.tests,
            sortable: true,
        },
        {
            name: 'Tests Per One Million',
            selector: row => row.testsPerOneMillion,
            sortable: true,
        },
        {
            name: 'Today Cases',
            selector: row => row.todayCases,
            sortable: true,
        },
        {
            name: 'Today Deaths',
            selector: row => row.todayDeaths,
            sortable: true,
        },
        {
            name: 'Today Recovered',
            selector: row => row.todayRecovered,
            sortable: true,
        },
        
        
    ];
    
    const countries = tableData.map ((country)=> (
        {
            title: country.country,
            active: country.active,
            cases: country.cases,
            activePerOneMillion: country.activePerOneMillion,
            cases: country.cases,
            casesPerOneMillion: country.casesPerOneMillion,
            continent: country.continent,
            critical: country.critical,
            criticalPerOneMillion: country.criticalPerOneMillion,
            deaths: country.deaths,
            deathsPerOneMillion: country.deathsPerOneMillion,
            oneCasePerPeople: country.oneCasePerPeople,
            oneDeathPerPeopl: country.oneDeathPerPeople,
            oneTestPerPeople: country.oneTestPerPeople,
            population: country.population,
            recovered: country.recovered,
            recoveredPerOneMillion: country.recoveredPerOneMillion,
            tests: country.tests,
            testsPerOneMillion: country.testsPerOneMillion,
            todayCases: country.todayCases,
            todayDeaths: country.todayDeaths,
            todayRecovered: country.todayRecovered

        }
    ))

    const row = countries;
    

 
    return (
        <DataTable
            columns={columns}
            data={row}
            pagination 
        />
    )
}


export default Table
