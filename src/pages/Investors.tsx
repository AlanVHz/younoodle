import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/fetchAndParseCSV";
import { useNavigate } from "react-router-dom";
import { LocalStorageClient } from "../api/LocalStorageClient";
import {
  Industry,
  InvestorProfile,
} from "../types/investors.interface";
import { matchInvestorsWithStartups } from "../utils/investorsMatcher";

function Investors() {
  const [matches, setMatches] = useState<any>([]);
  const localStorageClient = new LocalStorageClient();
  const navigate = useNavigate();

  useEffect(() => {
    const matchedData = localStorageClient.getItem(localStorageClient.investorsWithStartups);

    const fetchCsvData = async () => {
      console.log("Fetching CSV data...");
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");

      const result = matchInvestorsWithStartups(investorsData, startupData);
      localStorageClient.setItem(
        localStorageClient.investorsWithStartups,
        JSON.stringify(result)
      );

      console.log("Result: ", result)
      setMatches(result)

      // Temporary?
      localStorageClient.setItem("investorsCsv", JSON.stringify(investorsData));
      localStorageClient.setItem("startupCsv", JSON.stringify(startupData));
    };

    matchedData ? setMatches(JSON.parse(matchedData)) : fetchCsvData();
  }, []);

  const handleInvestorEvent = (item: InvestorProfile) => {
    navigate("/investor/" + item.id);
    console.log("Investor clicked: ", item);
  };

  return (
    <div className='container my-3'>
      <p className='text-4xl my-4'>Our Investors</p>
      <ul className='grid grid-cols-3 auto-rows-auto gap-4'>
        { matches.map((item: InvestorProfile, index: number) => {
          return (
            <li
              onClick={() => handleInvestorEvent(item)}
              className='flex flex-col row-span-1 border cursor-pointer rounded border-gray-300 p-2'
              key={item.id}
            >
              <p>
                Investor: <b>{item.name}</b>
              </p>
              <p>
                Industry: <b>{item.industry}</b>
              </p>
              <div>
                <p>Startups: </p>
                <ul>
                  { item.startups?.map((startup: string[]) => {
                    return <li key={startup[0]}><b>{startup[0]} - {startup[1]}</b></li>
                  }) }
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Investors;
