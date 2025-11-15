/**
 * Copyright (c) 2025, Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import { Card } from "@/components/ui/card";
import { FC, useState } from 'react'
import Basic from "../../app/basic";
import TripForm from "./TripForm"
import ResultsContainer from "./ResultsContainer";

export const Home: FC = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setSubmitted(false);

    try {
      // Call the externalized API function
      // const result = await fetchGpuCost(calculationData);
      setSubmitted(true); // Set submitted to true on success
      // setData(result.data); // Store the successful response
      setData({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-3xl mx-auto">
        <TripForm 
          onCalculate={handleCalculate} 
          loading={loading}
          submitted={submitted}
          setSubmitted={setSubmitted}
          error={error}
          setError={setError}
        />
        <ResultsContainer result={data} isVisible={submitted} />
        <Basic />
      </Card>
    </div>
  );
}
