import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/fetchAndParseCSV";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../api/ApiClient";

interface InvestorMatch {
  investor: string;
  startup: string;
  industry: string;
}

function Investors() {
  const [matches, setMatches] = useState<InvestorMatch[]>([]);
  const apiClient = new ApiClient();
  const navigate = useNavigate();

  const makeMatches = (
    investorsCopy: string[][],
    startupDataCopy: string[][]
  ) => {
    const matches: InvestorMatch[] = [];

    for (const investor of investorsCopy) {
      let matchesCount = 0;
      for (const startup of startupDataCopy) {
        if (investor[1] === "any" || investor[1] === startup[1]) {
          matches.push({
            investor: investor[0],
            startup: startup[0],
            industry: investor[1],
          });
          matchesCount++;
          if (matchesCount >= 10) {
            break;
          }
        }
      }
    }

    setMatches(matches);
    apiClient.setItem("matchesObj", JSON.stringify(matches));
  };

  useEffect(() => {
    const matchedData = apiClient.getItem("matchesObj");
    const fetchCsvData = async () => {
      console.log("Fetching CSV data...");
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");
      makeMatches(investorsData, startupData);
    };

    matchedData ? setMatches(JSON.parse(matchedData)) : fetchCsvData();
  }, []);

  const handleInvestorEvent = (item: InvestorMatch) => {
    navigate("/investor");
    console.log("Investor clicked: ", item);
  };

  return (
    <div className='container mx-auto px-4 py-4'>
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
                Investor: <b>{item.investor}</b>
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
