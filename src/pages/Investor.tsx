import React, { ChangeEvent, useEffect, useState } from "react";
import { ApiClient } from "../api/ApiClient";
import { Industry, InvestorProfile } from "../types/investors.interface";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeletedStartup,
  addDeletedStartupToStore,
  addModifiedInvestorToStore,
  getLatestInvestorDeletedStartups,
  updateInvestorInMatchedObject,
} from "../utils/dataUpdate";
import { generateRandomStartup } from "../utils/startupGenerator";
import { generateUUID } from "../utils/uuidGenerator";

function Investor() {
  const apiClient = new ApiClient();
  const navigate = useNavigate();
  const industryValues = Object.values(Industry);

  // Source of truth
  const [investor, setInvestor] = useState<InvestorProfile>({
    name: "",
    startups: [],
  });
  // We create an investorsName state to not interfere with the "addStartup" feature
  const [investorsName, setInvestorsName] = useState("");
  const [investorsIndustry, setInvestorsIndustry] = useState(Industry.Any);
  const [createMode, setCreateMode] = useState(false);
  const params = useParams();

  useEffect(() => {
    const data = apiClient.getInvestor(params.id ?? "") as InvestorProfile;

    if (Object.keys(data).length === 0) {
      setInvestor({
        name: "Investor's name...",
        startups: [],
        industry: undefined,
        id: generateUUID(),
      });
      setCreateMode(true);
    } else {
      setInvestor(data);
      setInvestorsName(data.name ?? "default");
    }

    console.log("Investor: ", data);
  }, []);

  const deleteStartupFromArray = (index: number) => {
    let currentStartups = [...investor.startups!];
    currentStartups.splice(index, 1);
    return currentStartups;
  };

  const addStartupToArray = (startup: string[]) => {
    let currentStartups = [...investor.startups!];
    currentStartups.push(startup);
    return currentStartups;
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    let payload = { ...investor };
    payload.name = investorsName;
    payload.industry = investorsIndustry;

    const modifiedInvestorsList = addModifiedInvestorToStore(payload);
    console.log("New Investor: ", modifiedInvestorsList);

    const newMatchedObj = updateInvestorInMatchedObject(payload);
    console.log("New Matched Object: ", newMatchedObj);

    navigate("/investors");
  };

  const handleInvestorNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvestorsName(e.target.value);
  };

  const handleStartupDeletion = (startup: string[], index: number) => {
    const newStartupsList = deleteStartupFromArray(index);
    const deletedStartup: DeletedStartup = {
      name: startup[0],
      industry: startup[1] as Industry,
      investorsName: investor.name,
      investorsId: investor.id,
    };

    addDeletedStartupToStore(deletedStartup);
    setInvestor({ ...investor, startups: newStartupsList });
  };

  const handleAddStartupEvent = () => {
    let latestStartupOfCurrentInvestor: DeletedStartup =
      getLatestInvestorDeletedStartups(investor.id!);
    let newStartupList: string[][] = [];

    console.log("Latest Startup: ", latestStartupOfCurrentInvestor);

    if (
      latestStartupOfCurrentInvestor.name &&
      latestStartupOfCurrentInvestor.industry
    ) {
      newStartupList = addStartupToArray([
        latestStartupOfCurrentInvestor.name,
        latestStartupOfCurrentInvestor.industry,
      ]);
    } else {
      const randomStartup = generateRandomStartup(investorsIndustry);
      newStartupList = addStartupToArray([randomStartup[0], randomStartup[1]]);
      console.log("Random Startup: ", randomStartup);
    }

    console.log("New Startups List: ", newStartupList);
    setInvestor({ ...investor, startups: newStartupList });
  };

  const isValidInvestor = (): boolean => {
    return !(investorsName.length > 1 && (investor.startups!.length >= 1))
  }

  const handleIndustryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInvestor({...investor, startups: [] })
    setInvestorsIndustry(e.target.value as Industry)
  }

  return (
    <>
      <div className='container flex justify-center'>
        <form onSubmit={handleFormSubmit} className='w-full max-w-sm mt-20'>
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
                htmlFor='inline-full-name'
              >
                Name
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:teal-500'
                id='inline-full-name'
                type='text'
                value={investorsName}
                onChange={handleInvestorNameChange}
                name='name'
                aria-label="Investor's name"
                aria-required="true"
                aria-describedby="Investor's name"
              />
            </div>
          </div>
          <div className='flex items-center justify-center mb-6'>
            {createMode ? (
              <div className='flex items-center justify-center md:w-3/3'>
                <label
                  htmlFor='industry'
                  className='text-gray-500 font-bold mb-1 pr-4'
                >
                  Industry
                </label>
                <div>
                  <select
                    aria-label="Investor's industry"
                    aria-required="true"
                    aria-describedby="Investor's industry"
                    id='industry'
                    name='industry'
                    value={investorsIndustry}
                    onChange={handleIndustryChange}
                    className='py-2 px-4 bg-gray-200 border-2 border-gray-200 rounded w-full text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-teal-500'
                  >
                    {industryValues.map((industry) => {
                      return <option key={industry}>{industry}</option>;
                    })}
                  </select>
                </div>
              </div>
            ) : (
              <div className='md:w-3/3'>
                <p className='text-gray-500 font-bold'>
                  Industry: <b className='text-black'>{investor?.industry}</b>
                </p>
              </div>
            )}
          </div>
          <div className='flex justify-center'>
            <table className='block table-fixed min-h-96'>
              <thead>
                <tr className='text-gray-500 font-bold'>
                  <th className="w-20">Startup</th>
                  <th className="w-20">Industry</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {investor?.startups?.map((startup: string[], index) => {
                  return (
                    <tr className="border-b" key={startup[0]}>
                      <td className='py-2 px-4 text-sm'>{startup[0]}</td>
                      <td className='py-2 px-4 text-sm'>{startup[1]}</td>
                      <td className='py-2 px-4 text-sm text-red-700 cursor-pointer'>
                        <button
                          aria-label="Delete startup from the list"
                          type='button'
                          onClick={() => {
                            handleStartupDeletion(startup, index);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='flex items-center justify-center'>
            {investor.startups!.length < 10 && (
              <div className='w-3/3 mt-5 mx-2'>
                <button
                  aria-label="Add startup"
                  onClick={handleAddStartupEvent}
                  className='shadow bg-teal-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded focus:bg-teal-800'
                  type='button'
                >
                  Add Startup
                </button>
              </div>
            )}
            <div className='w-3/3 mt-5 mx-2'>
              <button
                aria-label="Save changes"
                className='shadow bg-teal-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 focus:bg-teal-800'
                type='submit'
                disabled={isValidInvestor()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Investor;
