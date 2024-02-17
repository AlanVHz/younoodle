import React, { ChangeEvent, useEffect, useState } from "react";
import { ApiClient } from "../api/ApiClient";
import { Industry, InvestorProfile } from "../types/investors.interface";
import { useParams } from "react-router-dom";

function Investor() {
  const apiClient = new ApiClient();

  // Source of truth
  const [investor, setInvestor] = useState<InvestorProfile | undefined>();

  // Name edition state
  const [investorName, setInvestorName] = useState<string>("");

  const params = useParams();
  const industryValues = Object.values(Industry);

  useEffect(() => {
    const data = apiClient.get(params.id ?? "") as InvestorProfile;
    setInvestor(data);
    setInvestorName(data.name || "");

    console.log("Investor: ", data)
  }, []);


  const handleInputChange = (e: ChangeEvent<any>) => {
    // const { name, value } = e.target;
    // setInvestorData({ ...investorData, [name]: value });
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault()
  }

  const handleInvestorNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvestorName(e.target.value)
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className='w-full max-w-sm'>
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
            value={investorName}
            onChange={handleInputChange}
            name="name"
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label
            className='block text-gray-500 font-bold tracking-wide md:text-right pr-4 mb-2'
            htmlFor='grid-state'
          >
            Industry
          </label>
        </div>
        <div className='relative'>
          <select
            className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            id='grid-state'
            value={investor?.industry}
            onChange={handleInputChange}
            name="industry"
          >
            {industryValues.map((item: string) => {
              return <option key={item}>{item}</option>;
            })}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='fill-current h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>
      </div>
      <div className='md:flex md:items-center'>
        <div className='md:w-1/3'></div>
        <div className='md:w-2/3'>
          <button
            className='shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
            type='submit'
          >
            Save
          </button>
        </div>
      </div>
    </form>
    </>
  );
}

export default Investor;
