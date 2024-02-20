import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/fetchAndParseCSV";
import { useNavigate } from "react-router-dom";
import {
  InvestorProfile,
} from "../types/investors.interface";
import { matchInvestorsWithStartups } from "../utils/investorsMatcher";
import { ApiClient } from "../api/ApiClient";
import { LocalStorageKeys } from "../types/storage.interface";

function Investors() {
  const [matches, setMatches] = useState<InvestorProfile[]>([]);
  const navigate = useNavigate();
  const apiClient = new ApiClient();

  useEffect(() => {
    const matchedData = apiClient.getMatchedInvestorsStartupsData();

    const fetchCsvData = async () => {
      console.log("Fetching CSV data from files...");
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");

      const result = matchInvestorsWithStartups(investorsData, startupData);

      apiClient.setMatchedInvestorsStartupsData(result)
      apiClient.setData(LocalStorageKeys.INVESTORS, JSON.stringify(investorsData));
      apiClient.setData(LocalStorageKeys.STARTUPS, JSON.stringify(startupData));

      console.log("fetchCsvData result: ", result)
      setMatches(result)
    };

    console.log("matchedData: ", matchedData)
    matchedData.length > 1 ? setMatches(matchedData) : fetchCsvData();
  }, []);

  const handleInvestorEvent = (item: InvestorProfile) => {
    navigate("/investor/" + item.id);
    console.log("Investor clicked: ", item);
  };

  return (
    <div className='container py-4'>
      <p className='text-4xl my-10'>Investor's List</p>
      <ul className='flex flex-row flex-wrap gap-4 justify-around'>
        { matches.map((item: InvestorProfile, index: number) => {
          return (
            <li
              onClick={() => handleInvestorEvent(item)}
              className='min-w-80 lg:basis-1/5 md:basis-1/3 sm:basis-1/2 border cursor-pointer rounded border-teal-500 p-4 hover:shadow-lg hover:border-teal-600'
              key={item.id}
            >
              <p className="text-4xl">
                {item.name}
              </p>
              <p className="text-lg border-b-2 border-teal-600">
                {item.industry}
              </p>
              <div className="pt-3">
                <p>Startups ({item.startups?.length}): </p>
                <ul>
                  { item.startups?.map((startup: string[]) => {
                    return <li key={startup[0]}><p className="text-sm">{startup[0]}  <small>{startup[1]}</small></p></li>
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
