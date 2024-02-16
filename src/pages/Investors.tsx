import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/fetchAndParseCSV";
import { useNavigate } from "react-router-dom";
import { LocalStorageClient } from "../api/LocalStorageClient";
import { Industry, InvestorProfile } from "../types/investors.interface";

function Investors() {
  const [matches, setMatches] = useState<InvestorProfile[]>([]);
  const localStorageClient = new LocalStorageClient();
  const navigate = useNavigate();

  const makeMatches = (
    investorsCopy: string[][],
    startupDataCopy: string[][]
  ) => {
    const matches: InvestorProfile[] = [];

    for (const investor of investorsCopy) {
      let matchesCount = 0;
      for (const startup of startupDataCopy) {
        if (investor[1] === "any" || investor[1] === startup[1]) {
          matches.push({
            id: `${investor[0]}-${startup[0]}`,
            name: investor[0],
            industry: investor[1] as Industry,
            startup: startup[0],
            startupIndustry: startup[1] as Industry,
          });
          matchesCount++;
          if (matchesCount >= 10) {
            break;
          }
        }
      }
    }

    setMatches(matches);
    localStorageClient.setItem("investors", JSON.stringify(matches));
  };

  useEffect(() => {
    const matchedData = localStorageClient.getItem("investors");
    const fetchCsvData = async () => {
      console.log("Fetching CSV data...");
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");
      makeMatches(investorsData, startupData);
    };

    matchedData ? setMatches(JSON.parse(matchedData)) : fetchCsvData();
  }, []);

  const handleInvestorEvent = (item: InvestorProfile) => {
    navigate("/investor/" + item.id);
    console.log("Investor clicked: ", item);
  };

  return (
    <div className='container'>
      <p className='text-4xl my-4'>Our Investors</p>
      <ul className='grid grid-cols-3 auto-rows-auto gap-4'>
        {matches.map((item, index) => {
          return (
            <li
              onClick={() => handleInvestorEvent(item)}
              className='flex flex-col row-span-1 border cursor-pointer rounded border-gray-300 p-2'
              key={item.startup + index}
            >
              <p>
                Investor: <b>{item.name}</b>
              </p>
              <p>
                Industry: <b>{item.startup}</b>
              </p>
            </li>
          );
        })}

        {/* {startupData.map((item) => {
            return (
              <li key={item[0]}>
                Startup: {item[0]}, Industry: {item[1]}{" "}
              </li>
            );
          })} */}
      </ul>
    </div>
  );
}

export default Investors;
