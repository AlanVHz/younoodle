import React, { useEffect, useState } from "react";
import { ApiClient } from "../api/ApiClient";
import { InvestorProfile } from "../types/investors.interface";
import { useParams } from "react-router-dom";

function Investor() {
  const apiClient = new ApiClient();
  const [investor, setInvestor] = useState<InvestorProfile | undefined>();
  const [editionEnabled, setEditionEnabled] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    const data = apiClient.get(params.id ?? "") as InvestorProfile;
    setInvestor(data);
  }, []);

  return (
    <>
      <div className='container'>
        <p className='text-4xl my-4'>Investor</p>
        <div className='mt-10 flex flex-column'>
          <div className='flex flex-row'>
            {editionEnabled ? (
              <div className='sm:col-span-4'>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                    <input
                      type='text'
                      name='username'
                      id='username'
                      autoComplete='username'
                      className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                      placeholder={investor?.name}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p>
                <b>Name: </b>
                {investor?.name}
              </p>
            )}
            <button
              className='border rounded py-1 px-2 mx-4'
              onClick={() => {
                setEditionEnabled(!editionEnabled);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Investor;
