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

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FC, useState } from 'react'
import { TransferView } from "../transfer";
import TripForm from "./TripForm"
import ResultsContainer from "./ResultsContainer";

export const Home: FC = () => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto shadow-lg border-0">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl md:text-4xl font-bold">
            🖥️ GPU Carbon Calculator
          </CardTitle>
          <p className="text-blue-100 mt-2">
            Estimate the carbon footprint of your GPU computing activities
          </p>
        </CardHeader>
        
        <CardContent className="pt-8">
          <TripForm 
            onCalculate={handleCalculate} 
            loading={loading}
            submitted={submitted}
            setSubmitted={setSubmitted}
            error={error}
            setError={setError}
          />
          <ResultsContainer result={data} isVisible={submitted} />
        </CardContent>
      </Card>

      {/* Info Footer */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-gray-600 text-sm">
          💡 Tip: After calculating your emissions, you can offset them by purchasing carbon credits in our marketplace.
        </p>
      </div>
    </div>
  );
}
