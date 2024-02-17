import React, { ChangeEvent, useEffect, useState } from "react";
import { ApiClient } from "../api/ApiClient";
import { Industry, InvestorProfile } from "../types/investors.interface";
import { useParams } from "react-router-dom";

function Investor() {
  const apiClient = new ApiClient();

  // Source of truth
  const [investor, setInvestor] = useState<InvestorProfile>({ name: "" });

  const params = useParams();
  //const industryValues = Object.values(Industry);

  useEffect(() => {
    const data = apiClient.get(params.id ?? "") as InvestorProfile;
    setInvestor(data);

    console.log("Investor: ", data);
  }, []);

  const deleteStartupFromArray = (index: number) => {
    let currentStartups = [...investor.startups!];
    currentStartups.splice(index, 1);
    return currentStartups;
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    console.log("New Investor: ", investor);
  };

  // ToDo: manage sessionstorage logic for deleted elements
  const handleInvestorNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvestor({ ...investor, name: e.target.value });
  };

  const handleStartupDeletion = (index: number) => {
    const newStartupsList = deleteStartupFromArray(index);
    setInvestor({ ...investor, startups: newStartupsList });
  };

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
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                id='inline-full-name'
                type='text'
                value={investor.name}
                onChange={handleInvestorNameChange}
                name='name'
              />
            </div>
          </div>
          <div className='flex items-center justify-center mb-6'>
            <div className='md:w-1/3'>
              <p className='text-gray-500 font-bold'>
                Industry: <b className='text-black'>{investor?.industry}</b>
              </p>
            </div>
          </div>
          <div className='flex justify-center'>
            <table className='table-auto'>
              <thead>
                <tr className='text-gray-500 font-bold'>
                  <th>Startup</th>
                  <th>Industry</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {investor?.startups?.map((startup: string[], index) => {
                  return (
                    <tr key={startup[0]}>
                      <td className='py-2 px-4 text-sm'>{startup[0]}</td>
                      <td className='py-2 px-4 text-sm'>{startup[1]}</td>
                      <td className='py-2 px-4 text-sm text-red-700 cursor-pointer'>
                        <button
                          type='button'
                          onClick={() => {
                            handleStartupDeletion(index);
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
            <div className='w-3/3 mt-5'>
              <button
                className='shadow bg-teal-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
                type='submit'
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
