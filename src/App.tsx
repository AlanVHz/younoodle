import React, { useEffect, useState } from "react";
import "./App.css";
import { fetchAndParseCSV } from "./utils/fetchAndParseCSV";

function App() {
  const [investorsData, setInvestorsData] = useState<string[][]>([]);
  const [startupData, setStartupData] = useState<string[][]>([]);

  const makeMatches = (investorsCopy: string[][], startupDataCopy: string[][]) => {
    
    const matches = [];

    for (const investor of investorsCopy) {
      let matchesCount = 0;
      for (const startup of startupDataCopy) {
        if (investor[1] === "any" || investor[1] === startup[1]) {
          console.log(`investor: ${investor[0]} with industry: ${investor[1]} |  Startup: ${startup[0]} with industry: ${startup[1]}`)
          matches.push({ investor: investor[0], startup: startup[0] });
          matchesCount++;
          if (matchesCount >= 10) {
            break;
          }
        }
      }
    }

    console.log(matches);
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      setInvestorsData(investorsData);

      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");
      setStartupData(startupData);

      makeMatches(investorsData, startupData);
    };

    fetchCsvData();
  }, []);

  return (
    <>
      <ul>
        {investorsData.map((item) => {
          return (
            <li key={item[0]}>
              Investor: {item[0]}, Industry: {item[1]}{" "}
            </li>
          );
        })}

        {startupData.map((item) => {
          return (
            <li key={item[0]}>
              Startup: {item[0]}, Industry: {item[1]}{" "}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
