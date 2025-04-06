import Image from "next/image";
import { IdValidationProvider } from '../context/idValidationContext';
import IdValidationForm from './components/IdValidationForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">South African ID Validation System</h1>
        
        <div className="mb-8">
          <IdValidationProvider>
            <IdValidationForm />
          </IdValidationProvider>
        </div>
        
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About South African ID Numbers</h2>
          <p className="mb-4">
            South African ID numbers follow a specific format: YYMMDD SSSS 0 Z C
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>YYMMDD</strong>: Date of birth</li>
            <li><strong>SSSS</strong>: Gender (Female: 0000-4999, Male: 5000-9999)</li>
            <li><strong>0</strong>: Citizenship status (0: Citizen, 1: Permanent Resident)</li>
            <li><strong>Z</strong>: Race classification (historical, now fixed as 8)</li>
            <li><strong>C</strong>: Checksum digit calculated using the Luhn algorithm</li>
          </ul>
          <p>
            This system validates ID numbers both locally (format and checksum) and through the 
            South African Home Affairs API for official verification.
          </p>
        </div>
      </div>
    </main>
  );
}
