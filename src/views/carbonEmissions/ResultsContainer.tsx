import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import Link from 'next/link';

interface ResultsContainerProps {
  result: Record<string, unknown> | null;
  isVisible: boolean;
}

export default function ResultsContainer({ result, isVisible }: ResultsContainerProps) {
  return (
    <>
      {isVisible && (
        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl border-[#E0E0E0]">
          <CardContent className="px-10 py-10 space-y-6">
            <div className="w-full">
              <div className="flex flex-col items-center w-full">
                <div className="w-full">
                  <h3 className="text-[1.25rem] text-gray-800 mb-4 font-bold text-center">Calculation Results</h3>
                  <ul className="text-gray-700 leading-relaxed space-y-2 w-full">
                    <li className="w-full flex justify-between items-center bg-blue-50 p-3 rounded">
                      <span className="font-semibold">CO2 Emitted:</span>
                      <span className="text-blue-600 font-bold">{result && String(result.co2Tons)} tons</span>
                    </li>
                    <li className="w-full flex justify-between items-center bg-green-50 p-3 rounded">
                      <span className="font-semibold">Power Used:</span>
                      <span className="text-green-600 font-bold">{result && String(result.energyKwh)} KW</span>
                    </li>
                    <li className="w-full flex justify-between items-center bg-orange-50 p-3 rounded">
                      <span className="font-semibold">Credits Needed:</span>
                      <span className="text-orange-600 font-bold">{result && String(result.creditsNeeded)} units</span>
                    </li>
                    <li className="w-full flex justify-between items-center bg-purple-50 p-3 rounded">
                      <span className="font-semibold">Estimated Cost:</span>
                      <span className="text-purple-600 font-bold">{result && 'Varies'} USDC</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href={"/marketplace"} className="block w-full">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg h-12 font-semibold">
                Offset These Emissions in Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  )
}