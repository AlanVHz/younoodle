import React, { useEffect, useState } from "react";
import { fetchAndParseCSV } from "../utils/fetchAndParseCSV";
import { useNavigate } from "react-router-dom";
import { InvestorProfile } from "../types/investors.interface";
import { matchInvestorsWithStartups } from "../utils/investorsMatcher";
import { ApiClient } from "../api/ApiClient";
import {
  CommonStorageKeys,
  LocalStorageKeys,
  SessionStorageKeys,
} from "../types/storage.interface";

function Investors() {
  const [matches, setMatches] = useState<InvestorProfile[]>([]);
  const [showAllDataToggle, setShowAllDataToggle] = useState(false);
  const navigate = useNavigate();
  const apiClient = new ApiClient();

  useEffect(() => {
    const matchedData = apiClient.getMatchedInvestorsStartupsData();

    const fetchCsvData = async () => {
      console.log("Fetching CSV data from files...");
      const investorsData = await fetchAndParseCSV("assets/csv/investors.csv");
      const startupData = await fetchAndParseCSV("assets/csv/startups.csv");

      const result = matchInvestorsWithStartups(investorsData, startupData);

      apiClient.setMatchedInvestorsStartupsData(result);
      apiClient.setData(
        LocalStorageKeys.INVESTORS,
        JSON.stringify(investorsData)
      );
      apiClient.setData(LocalStorageKeys.STARTUPS, JSON.stringify(startupData));

      console.log("fetchCsvData result: ", result);
      setMatches(result);
    };

    console.log("matchedData: ", matchedData);
    matchedData.length > 1 ? setMatches(matchedData) : fetchCsvData();
  }, []);

  const handleInvestorEvent = (item: InvestorProfile) => {
    navigate("/investor/" + item.id);
    console.log("Investor clicked: ", item);
  };

  const handleShowModifiedEvent = () => {
    let parsedData: InvestorProfile[];
    let storeData: string | null;

    storeData = !showAllDataToggle
      ? apiClient.getData(SessionStorageKeys.MODIFIED_INVESTORS)
      : apiClient.getData(CommonStorageKeys.MATCHED_INVESTORS_STARTUPS);

    parsedData = storeData && JSON.parse(storeData);
    setMatches(parsedData);
    setShowAllDataToggle(!showAllDataToggle);
  };

  return (
    <div className='container py-4'>
      <div className='my-10'>
        {showAllDataToggle ? (
          <button
            className='text-sm ml-5 underline'
            onClick={handleShowModifiedEvent}
          >
            Show all data
          </button>
        ) : (
          <button
            className='text-sm ml-5 underline'
            onClick={handleShowModifiedEvent}
          >
            Show modified data only
          </button>
        )}
      </div>
      <ul className='flex flex-row flex-wrap gap-4 justify-start'>
        {matches && matches.map((item: InvestorProfile) => {
          return (
            <li
              onClick={() => handleInvestorEvent(item)}
              className='min-w-80 lg:basis-1/5 md:basis-1/3 sm:basis-1/2 border cursor-pointer rounded border-teal-500 p-4 hover:shadow-lg hover:border-teal-600'
              key={item.id}
            >
              <p className='text-4xl'>{item.name}</p>
              <p className='text-lg border-b-2 border-teal-600'>
                {item.industry}
              </p>
              <div className='pt-3'>
                <p>Startups ({item.startups?.length}): </p>
                <ul>
                  {item.startups?.map((startup: string[]) => {
                    return (
                      <li key={startup[0]}>
                        <p className='text-sm'>
                          {startup[0]} <small>{startup[1]}</small>
                        </p>
                      </li>
                    );
                  })}
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
