import React, { useEffect, useState } from "react";
import "./App.css";
import { fetchAndParseCSV } from "./utils/fetchAndParseCSV";

function App() {
  const [investorsData, setInvestorsData] = useState<string[][]>([]);
  const [startupData, setStartupData] = useState<string[][]>([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      setInvestorsData(investorsData);

      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");
      setStartupData(startupData);
    };

    fetchCsvData();
  }, []);

  return (
    <>
      <ul>
        { investorsData.map((item) => {
          return <li key={item[0]}>Investor: {item[0]}, Industry: {item[1]} </li>
        }) }

        { startupData.map((item) => {
          return <li key={item[0]}>Startup: {item[0]}, Industry: {item[1]} </li>
        }) }
      </ul>
    </>
  );
}

export default App;
