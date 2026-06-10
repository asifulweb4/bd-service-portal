import React, { useRef } from 'react';
import { BirthCertificateInput, DeathCertificateInput, NIDInput } from '../types';
import { BARCODE_MOCK_IMAGE, OFFICIAL_GOVT_SEAL, NID_BD_LOGO, SIGNATURE_SAMPLES } from '../data';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DocumentWrapperProps {
  onBack: () => void;
  title: string;
  children: React.ReactNode;
}

function DocumentWrapper({ onBack, title, children }: DocumentWrapperProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (!printContent) return;

    // Create a printable window or rewrite-body with print stylesheets
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;750&display=swap');
              body {
                font-family: 'Inter', sans-serif;
                background-color: white;
                color: black;
                padding: 10px;
              }
              @media print {
                .no-print { display: none !important; }
                body { padding: 0; margin: 0; }
                .print-page {
                  width: 100%;
                  box-shadow: none !important;
                  border: none !important;
                  margin: 0 !important;
                  padding: 20px !important;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="print-page max-w-4xl mx-auto">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white border border-purple-100 p-4 rounded-2xl shadow-xs no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:text-purple-950 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Desk (ফিরে যান)
        </button>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-mono">
            <ShieldCheck size={12} /> SECURE GENERATED PDF
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer size={14} /> Print / Save PDF (মুদ্রণ করুন)
          </button>
        </div>
      </div>

      <div ref={printAreaRef} className="bg-white border rounded-2xl shadow-lg p-3 sm:p-8 overflow-x-auto relative">
        {children}
      </div>
    </div>
  );
}

// 1. Birth Registration Certificate Bilingual
export function BirthCertificateDoc({ data, onBack }: { data: BirthCertificateInput; onBack: () => void }) {
  const randomCrestBarcode = `BRN-${data.regNo}`;
  return (
    <DocumentWrapper onBack={onBack} title={`BirthCertificate-${data.regNo}`}>
      <div className="width-container min-w-[750px] border-8 border-green-700 p-6 bg-emerald-50/5 relative text-gray-900 leading-normal text-xs font-sans">
        {/* Border corner watermarks */}
        <div className="absolute top-1 left-1 text-[10px] font-mono font-bold text-green-700">BR-BD</div>
        <div className="absolute top-1 right-1 text-[10px] font-mono font-bold text-green-700">LGRD</div>
        <div className="absolute bottom-1 left-1 text-[10px] font-mono font-bold text-green-700">M-BD</div>
        <div className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-green-700">GOVT</div>

        {/* Header crest and Ministry titles */}
        <div className="flex justify-between items-start mb-6 text-center">
          <div className="w-1/4 flex flex-col items-center">
            <span className="text-[9px] font-bold text-green-800">BRN Code: {data.regNo.substring(0, 6)}</span>
            <img src={OFFICIAL_GOVT_SEAL} alt="Seal" className="w-16 h-16 mt-2 opacity-90" />
          </div>
          
          <div className="w-2/4 space-y-1">
            <p className="text-sm font-extrabold text-green-800">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
            <p className="text-[10px] font-bold text-gray-600">স্থানীয় সরকার, পল্লী উন্নয়ন ও সমবায় মন্ত্রণালয়</p>
            <p className="text-xs font-bold text-green-900 border-b border-green-700 pb-1 uppercase tracking-tight">
              Ministry of Local Government, Rural Development & Co-operatives
            </p>
            <p className="text-lg font-black text-green-700 mt-2 font-sans">জন্ম নিবন্ধন সনদপত্র</p>
            <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Birth Registration Certificate</p>
            <p className="text-[8px] text-gray-500 font-medium font-mono">[বিধী ৯, জন্ম ও মৃত্যু নিবন্ধন (স্থানীয় সরকার সংশোধন) বিধিমালা, ২০০৬]</p>
          </div>

          <div className="w-1/4 flex flex-col items-center justify-end h-full pt-4">
            <div className="p-1.5 border-2 border-green-800 rounded bg-white font-mono text-[9px] font-bold text-center">
              <div>REGISTRY ACTIVE</div>
              <div className="text-green-700 mt-0.5">{data.regNo}</div>
            </div>
          </div>
        </div>

        {/* Certificate metadata blocks */}
        <div className="grid grid-cols-4 border border-green-700 divide-x divide-green-700 bg-green-50/20 text-center text-[10px] font-bold py-1 mb-6">
          <div>
            <p className="text-green-800">নিবন্ধন বই নং:</p>
            <p className="text-gray-700">Book No: <span className="font-mono">03</span></p>
          </div>
          <div>
            <p className="text-green-800">নিবন্ধনের তারিখ:</p>
            <p className="text-gray-700">Date of Reg: <span className="font-mono">15/02/2012</span></p>
          </div>
          <div>
            <p className="text-green-800">সনদ প্রদানের তারিখ:</p>
            <p className="text-gray-700">Date of Issue: <span className="font-mono">31/05/2026</span></p>
          </div>
          <div>
            <p className="text-green-800">জন্ম নিবন্ধন নম্বর:</p>
            <p className="text-green-700 text-xs font-mono">{data.regNo}</p>
          </div>
        </div>

        {/* Main demographics block */}
        <div className="border border-green-700 rounded-lg overflow-hidden divide-y divide-green-700">
          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">নাম (Bangla):</div>
            <div className="col-span-3 text-gray-800 font-extrabold pl-4 text-sm">{data.nameBangla}</div>
          </div>
          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">Name (English):</div>
            <div className="col-span-3 text-gray-800 font-mono font-bold pl-4 text-sm uppercase">{data.nameEnglish}</div>
          </div>
          
          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">জন্ম তারিখ (DOB):</div>
            <div className="col-span-3 text-gray-800 pl-4 font-bold flex gap-4 items-center">
              <span className="font-mono text-sm tracking-widest">{data.dob}</span>
              <span className="text-[10px] text-gray-400"> (DD/MM/YYYY)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">লিঙ্গ (Gender):</div>
            <div className="col-span-3 text-gray-800 pl-4 font-bold">MALE/পুরুষ</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3 bg-green-50/5">
            <div className="col-span-1 text-green-800 font-bold">পিতার নাম (Father):</div>
            <div className="col-span-3 pl-4 grid grid-cols-2">
              <span className="font-bold">{data.fatherBangla}</span>
              <span className="font-mono text-gray-600 uppercase text-[10px]">{data.fatherEnglish}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">মাতার নাম (Mother):</div>
            <div className="col-span-3 pl-4 grid grid-cols-2">
              <span className="font-bold">{data.motherBangla}</span>
              <span className="font-mono text-gray-600 uppercase text-[10px]">{data.motherEnglish}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-green-700 py-2.5 px-3">
            <div className="col-span-1 text-green-800 font-bold">জন্মস্থান (Birth Place):</div>
            <div className="col-span-3 pl-4 grid grid-cols-2 text-[11px]">
              <span className="font-bold">{data.birthPlaceBangla}</span>
              <span className="font-mono text-gray-600 uppercase text-[10px]">{data.birthPlaceEnglish}</span>
            </div>
          </div>
        </div>

        {/* Signatures and Seals lines Footer */}
        <div className="grid grid-cols-3 mt-12 gap-8 text-center text-[10px] font-bold text-gray-600">
          <div className="flex flex-col items-center justify-end">
            <div className="w-24 h-1 border-b border-gray-400 mb-2"></div>
            <p>প্রস্তুতকারীর স্বাক্ষর</p>
            <p className="text-[8px] text-gray-400">Prepared By</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <img src={OFFICIAL_GOVT_SEAL} alt="Seal water" className="w-12 h-12 opacity-85 mb-1" />
            <p className="text-green-800 font-extrabold text-[9px]">কার্যালয়ের সিলমোহর</p>
            <p className="text-[7px] text-gray-400">Office Seal</p>
          </div>

          <div className="flex flex-col items-center justify-end">
            <div className="relative w-full flex justify-center">
              <img src={SIGNATURE_SAMPLES[1]} alt="Sig" className="w-24 h-10 absolute -bottom-3 opacity-90" />
            </div>
            <div className="w-24 h-1 border-b border-gray-400 mb-2"></div>
            <p className="text-gray-800">নিবন্ধক ও স্থানীয় সীল</p>
            <p className="text-[8px] text-green-800 font-extrabold font-mono hover:underline cursor-pointer">Registrar Signature</p>
          </div>
        </div>

        {/* Verification barcode footer overlay */}
        <div className="flex justify-between items-center mt-12 pt-4 border-t border-green-700 text-[8px] text-gray-400 font-mono">
          <div>
            <p>Government of Bangladesh Ministry of IT security certification status: VERIFIED ONLINE</p>
            <p className="mt-0.5">SHA256 Fingerprint: de8ac9a28e792fb10129219eaef5001c</p>
          </div>
          
          {/* Mock QR generator */}
          <div className="flex gap-2 items-center bg-white p-1 border rounded">
            <div className="w-10 h-10 border flex flex-col justify-center items-center text-[5px] font-bold bg-green-50 text-green-800 border-green-900 leading-none">
              <div className="font-mono">BD-GOV</div>
              <div className="mt-1">SCAN</div>
              <div className="text-green-600">SECURE</div>
            </div>
            <div>
              <p className="font-bold text-[9px] text-green-700">SCAN TO VERIFY</p>
              <p className="text-[7px]">www.bdris.gov.bd</p>
            </div>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
}

// 2. Death Registration Certificate Bilingual
export function DeathCertificateDoc({ data, onBack }: { data: DeathCertificateInput; onBack: () => void }) {
  return (
    <DocumentWrapper onBack={onBack} title={`DeathCertificate-${data.regNo}`}>
      <div className="width-container min-w-[750px] border-8 border-gray-800 p-6 bg-white relative text-gray-950 text-xs leading-normal font-sans">
        
        {/* Border labels */}
        <div className="absolute top-1 left-1 text-[10px] font-mono font-bold text-gray-500">DRN-BD</div>
        <div className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-gray-500">UNION PARISHAD</div>

        <div className="flex justify-between items-center mb-6 text-center">
          <div className="w-1/4">
            <img src={OFFICIAL_GOVT_SEAL} alt="Seal" className="w-16 h-16 opacity-90 mx-auto" />
          </div>
          
          <div className="w-2/4">
            <p className="text-sm font-extrabold text-gray-900 border-b pb-0.5 uppercase tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
            <p className="text-[10px] font-bold text-gray-600 mt-1">স্থানীয় সরকার বিভাগ</p>
            <p className="text-base font-black text-gray-900 tracking-tight">মৃত্যু নিবন্ধন সনদপত্র</p>
            <p className="text-xs font-extrabold text-gray-600 uppercase tracking-widest font-mono">Death Certificate</p>
          </div>

          <div className="w-1/4">
            <div className="p-1 border border-black font-mono text-[9px] font-bold">
              <div>REGISTRY: VERIFIED</div>
              <div className="text-red-700 mt-0.5">{data.regNo}</div>
            </div>
          </div>
        </div>

        {/* ID info layout columns */}
        <div className="grid grid-cols-4 border divide-x border-black bg-gray-50 text-[10px] font-bold text-center py-1 mb-6">
          <div>নিবন্ধন স্থান: <span className="font-normal text-gray-700">Union Parishad</span></div>
          <div>নিবন্ধনের তারিখ: <span className="font-mono text-gray-700">11/04/2016</span></div>
          <div>সনদ প্রদানের তারিখ: <span className="font-mono text-gray-700">31/05/2026</span></div>
          <div>মৃত্যু নিবন্ধন নম্বর: <span className="font-mono text-red-600">{data.regNo}</span></div>
        </div>

        <div className="border border-black overflow-hidden divide-y divide-black">
          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">মৃতের নাম (Bangla):</div>
            <div className="col-span-3 text-gray-905 font-extrabold text-sm uppercase pl-4">{data.nameBangla}</div>
          </div>
          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">Deceased Name (Eng):</div>
            <div className="col-span-3 font-mono font-bold text-sm uppercase pl-4">{data.nameEnglish}</div>
          </div>
          
          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">মৃত্যুর তারিখ (Date of Death):</div>
            <div className="col-span-3 font-mono font-extrabold text-sm text-red-600 pl-4">{data.deathDate}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">পিতার নাম (Father):</div>
            <div className="col-span-3 pl-4 font-bold">{data.fatherBangla}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">মাতার নাম (Mother):</div>
            <div className="col-span-3 pl-4 font-bold">{data.motherBangla}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">স্বামী/স্ত্রীর নাম (Spouse):</div>
            <div className="col-span-3 pl-4 font-bold">{data.spouseBangla || 'N/A'}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3">
            <div className="col-span-1 text-gray-700 font-bold">মৃত্যুর স্থান (Place of Death):</div>
            <div className="col-span-3 pl-4 font-bold text-[11px]">{data.deathPlaceBangla} / <span className="font-mono text-gray-600 text-[10px]">{data.deathPlaceEnglish}</span></div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-black py-2.5 px-3 bg-red-50/10">
            <div className="col-span-1 text-gray-700 font-bold">মৃত্যুর কারণ (Cause of Death):</div>
            <div className="col-span-3 pl-4 font-bold text-sm text-gray-850 font-serif">{data.cause}</div>
          </div>
        </div>

        {/* Footer registrar stamp details */}
        <div className="grid grid-cols-3 mt-12 gap-8 text-center text-[10px] font-bold text-gray-600">
          <div>
            <div className="w-24 h-1 border-b border-gray-400 mb-2 mx-auto"></div>
            <p>তদন্তকারী কর্মকর্তার স্বাক্ষর</p>
            <p className="text-[8px] text-gray-400 font-mono">Investigated By</p>
          </div>
          
          <div className="flex flex-col items-center">
            <img src={OFFICIAL_GOVT_SEAL} alt="Seal base" className="w-10 h-10 opacity-70 mb-1" />
            <p>অফিসিয়াল সিলমোহর</p>
            <p className="text-[7px] text-gray-400">Office Stamp</p>
          </div>

          <div>
            <div className="relative w-full flex justify-center">
              <img src={SIGNATURE_SAMPLES[2]} alt="Sig" className="w-24 h-10 absolute -bottom-3 opacity-90" />
            </div>
            <div className="w-24 h-1 border-b border-gray-400 mb-2 mx-auto"></div>
            <p className="text-gray-900">সনদ প্রদানকারী কর্তৃপক্ষের দস্তখত</p>
            <p className="text-[8px] text-gray-400 font-mono">Registrar Signature and Seal</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-12 pt-2 border-t border-gray-400 text-[8px] text-gray-400 font-mono">
          <p>Local Union Parishad Registry Online Database (BDRIS Service Log system)</p>
          <p className="text-gray-500 font-bold">STATUS: FILED AND AUTHENTICATED</p>
        </div>
      </div>
    </DocumentWrapper>
  );
}

// 3. Bangladesh National Identity Card Front & Back Printable
export function NIDCardDoc({ data, onBack }: { data: NIDInput; onBack: () => void }) {
  const photoHolder = data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60';
  const customSignature = SIGNATURE_SAMPLES[0];

  return (
    <DocumentWrapper onBack={onBack} title={`NationalIdentity-${data.nidNo}`}>
      <div className="flex flex-wrap gap-10 justify-center items-center py-10 bg-slate-900/45 rounded-3xl border border-white/5 no-print p-6">
        
        {/* NID FRONT SIDE SMART CARD */}
        <div 
          id="nid_front_card_pane" 
          className="w-[430px] h-[270px] rounded-2xl border-2 border-emerald-600/30 p-3.5 bg-[linear-gradient(135deg,rgba(16,185,129,0.05)_0%,rgba(255,255,255,0.96)_50%,rgba(245,158,11,0.04)_100%)] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_-8px_rgba(16,185,129,0.2)] hover:scale-[1.01] transition-all duration-300 overflow-hidden relative flex flex-col justify-between text-gray-800 leading-normal select-none"
        >
          {/* Authentic Glossy reflection ribbon effect */}
          <div className="absolute -inset-x-20 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent rotate-12 pointer-events-none opacity-40"></div>
          
          {/* Card background watermark logo */}
          <div className="absolute right-4 bottom-4 w-48 h-48 opacity-[0.06] pointer-events-none select-none">
            <img src={NID_BD_LOGO} alt="bg logos" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>

          {/* Secure National Crest Header */}
          <div className="flex gap-2.5 items-center pb-2 border-b-[2px] border-emerald-700/80 relative">
            <img src={NID_BD_LOGO} alt="nid logo" className="w-10 h-10 shrink-0 filter drop-shadow-md" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-emerald-900 font-sans tracking-tight leading-none">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-[7.5px] font-mono font-extrabold text-slate-500 mt-0.5 uppercase tracking-wider leading-none">Government of the People's Republic of Bangladesh</p>
              <p className="text-[10px] font-extrabold text-red-650 font-sans mt-0.5 uppercase tracking-wider leading-none">National ID Card / জাতীয় পরিচয়পত্র</p>
            </div>
            
            {/* Hologram secure element */}
            <div className="w-9 h-9 rounded-full border-2 border-amber-400/40 bg-gradient-to-tr from-yellow-300/30 via-red-300/20 to-emerald-300/30 opacity-80 flex items-center justify-center font-mono text-[6px] text-amber-800 font-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]">
              <span className="animate-pulse">SECURE</span>
            </div>
          </div>

          {/* Core Card Demographics Body */}
          <div className="flex gap-4 flex-1 pt-2.5 relative">
            
            {/* Left Hand Column: Microchip & Photo Holder */}
            <div className="w-1/4 flex flex-col items-center shrink-0">
              {/* Photo Shield with rounded corners and double border */}
              <div className="w-20 h-[96px] bg-slate-50 border-2 border-emerald-700/80 rounded-lg overflow-hidden shadow-md relative">
                <img src={photoHolder} alt="NID Photo" className="w-full h-full object-cover grayscale contrast-115" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 inset-x-0 bg-emerald-800/80 text-[6px] font-bold text-center text-white py-0.5 uppercase tracking-wide">VERIFIED</div>
              </div>
              
              {/* High-Fidelity Smart Gold Chip Replica */}
              <div className="w-7 h-5.5 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-amber-600/60 p-0.5 mt-2 shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex flex-col justify-between shrink-0 hover:rotate-6 transition-transform">
                <div className="grid grid-cols-3 gap-0.5 h-full w-full bg-slate-900/10 rounded-xs">
                  <div className="border-r border-amber-600/30 border-b border-amber-600/30"></div>
                  <div className="border-r border-amber-600/30 border-b border-amber-600/30"></div>
                  <div className="border-b border-amber-600/30"></div>
                  <div className="border-r border-amber-600/30"></div>
                  <div className="border-r border-amber-600/30"></div>
                  <div className=""></div>
                </div>
              </div>
            </div>

            {/* Right Hand Column: Aligned Metadata */}
            <div className="w-3/4 space-y-1.5 text-[9px] font-bold text-gray-800 pt-0.5">
              <div className="flex border-b border-gray-100 pb-0.5">
                <span className="w-16 text-slate-500 uppercase tracking-wide text-[8px]">নাম:</span>
                <span className="text-[10px] text-emerald-950 font-black">{data.nameBangla}</span>
              </div>
              
              <div className="flex border-b border-gray-100 pb-0.5">
                <span className="w-16 text-slate-500 uppercase tracking-wide text-[8px]">Name:</span>
                <span className="text-[9.5px] font-mono text-gray-900 uppercase font-black">{data.nameEnglish}</span>
              </div>

              <div className="flex border-b border-gray-150/10 pb-0.5">
                <span className="w-16 text-slate-500 text-[8px]">পিতা:</span>
                <span className="text-gray-900 font-extrabold">{data.fatherName}</span>
              </div>

              <div className="flex border-b border-gray-150/10 pb-0.5">
                <span className="w-16 text-slate-500 text-[8px]">মাতা:</span>
                <span className="text-gray-900 font-extrabold">{data.motherName}</span>
              </div>

              <div className="flex items-center">
                <span className="w-16 text-slate-500 text-[8px]">Date of Birth:</span>
                <span className="text-red-650 font-mono text-[11px] tracking-wider font-black">{data.dob}</span>
              </div>

              <div className="flex items-center pt-1.5 gap-2.5 border-t border-emerald-800/10 mt-1">
                <span className="text-emerald-900 text-[9px] tracking-wider uppercase font-black shrink-0">ID NO:</span>
                <span className="text-base text-red-650 font-mono tracking-widest font-black leading-none">{data.nidNo}</span>
              </div>
            </div>
          </div>

          {/* Secure Card Footer with Digital Signature */}
          <div className="flex justify-between items-end border-t border-emerald-800/40 pt-1.5 px-0.5">
            <div className="flex flex-col items-center justify-center shrink-0">
              <img src={customSignature} alt="Signature" className="w-[68px] h-5.5 select-none grayscale contrast-125 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" referrerPolicy="no-referrer" />
              <p className="text-[5px] uppercase text-slate-400 font-mono font-extrabold tracking-wider mt-0.5">Holder Signature</p>
            </div>
            
            <div className="text-right">
              <div className="flex justify-end gap-1 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-[5px] uppercase text-emerald-800 font-mono font-black tracking-widest">National Selection Committee</p>
            </div>
          </div>
        </div>

        {/* NID BACK SIDE SMART CARD */}
        <div 
          id="nid_back_card_pane" 
          className="w-[430px] h-[270px] rounded-2xl border-2 border-slate-350/30 p-3.5 bg-[linear-gradient(135deg,rgba(240,240,240,0.7)_0%,rgba(255,255,255,0.98)_50%,rgba(235,235,235,0.8)_100%)] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_-8px_rgba(100,116,139,0.15)] hover:scale-[1.01] transition-all duration-300 overflow-hidden relative flex flex-col justify-between text-gray-800 leading-normal select-none"
        >
          {/* Card background watermark logo */}
          <div className="absolute left-6 top-6 w-40 h-40 opacity-[0.03] pointer-events-none">
            <img src={NID_BD_LOGO} alt="back watermark logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>

          {/* Secure Property Warning Header */}
          <div className="border-b border-slate-300/80 pb-1.5">
            <p className="text-[7.5px] font-bold text-center text-slate-500 leading-relaxed font-sans">
              এই কার্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সম্পত্তি। কার্ডটি ব্যবহারকারী ব্যতীত অন্য কোথাও পাওয়া গেলে নিকটস্থ পোস্ট অফিসে জমা দেওয়ার জন্য অনুরোধ করা হলো।
            </p>
          </div>

          {/* Back Core Interactive Parameters */}
          <div className="flex-1 pt-2.5 space-y-2 text-[8.5px] leading-relaxed font-bold text-slate-700">
            <div className="flex items-start">
              <span className="w-20 text-slate-400 shrink-0 uppercase tracking-wider text-[7px]">ঠিকানা / Address:</span>
              <span className="text-slate-800 font-extrabold">{data.address || 'গ্রাম/রাস্তা: আগ্রাবাদ সি/এ, ডাকঘর: জিপিও আগ্রাবাদ, পুলিশ স্টেশন: ডবলমুরিং, জেলা: চট্টগ্রাম'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-2 mt-2">
              <div className="flex items-center">
                <span className="w-16 text-slate-400 shrink-0 uppercase tracking-widest text-[7px]">রক্তের শ্রেণী:</span>
                <span className="text-red-650 font-black font-mono text-[11px] tracking-wide">{data.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-slate-400 shrink-0 uppercase tracking-widest text-[7px]">জন্মস্থান:</span>
                <span className="text-slate-800 uppercase text-[9px] font-black">{data.birthPlace || 'CHITTAGONG'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-1.5">
              <div className="flex items-center">
                <span className="w-16 text-slate-400 shrink-0 uppercase tracking-widest text-[7px]">প্রদানকারী:</span>
                <span className="text-slate-900 font-mono font-extrabold">Election Commission</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-slate-400 shrink-0 uppercase tracking-widest text-[7px]">PIN CODE:</span>
                <span className="text-slate-950 font-mono font-black text-[9.5px] tracking-wider">{data.pin || '1995281403212'}</span>
              </div>
            </div>
          </div>

          {/* Barcode details stack columns */}
          <div className="border-t border-slate-300 pt-2 mt-1 flex flex-col items-center">
            <img src={BARCODE_MOCK_IMAGE} alt="NID Back Barcode Stamp" className="w-[320px] h-9 shrink-0 opacity-80 filter contrast-125" referrerPolicy="no-referrer" />
            <p className="font-mono text-[7px] text-slate-400 mt-1 tracking-[0.25em] uppercase font-bold">
              &lt;BGD{data.nidNo}99&lt;&lt;&lt;&lt;&lt;&lt;&lt;9505232M955212
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-purple-600 bg-purple-50/70 p-3 rounded-xl mt-4 max-w-lg mx-auto no-print">
        Tip: Set your printer direction to <strong>Horizontal/Landscape</strong> before printing to download them perfectly sized for laminations!
      </div>
    </DocumentWrapper>
  );
}

// 4. NBR Official e-TIN Certificate Generator
export function TinCertificateDoc({ data, onBack }: { data: NIDInput; onBack: () => void }) {
  const tinNumberStr = `32194-${data.nidNo.substring(0, 4)}-${data.nidNo.substring(4, 9)}`;
  return (
    <DocumentWrapper onBack={onBack} title={`eTIN-Certificate-${tinNumberStr}`}>
      <div className="width-container min-w-[750px] border-4 border-double border-gray-800 p-8 bg-white text-gray-900 text-xs leading-normal font-sans">
        
        {/* NBR Crest and header details */}
        <div className="text-center border-b-2 border-gray-950 pb-4 mb-6">
          <img src={OFFICIAL_GOVT_SEAL} alt="Gov Seal" className="w-16 h-16 opacity-90 mx-auto" />
          <p className="text-sm font-extrabold text-gray-900 uppercase mt-1">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
          <p className="text-xs font-bold text-gray-600">জাতীয় রাজস্ব বোর্ড, ঢাকা</p>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight mt-1 border-b pb-0.5">National Board of Revenue, Dhaka</p>
          <p className="text-base font-extrabold text-indigo-900 mt-3 tracking-wide">TIN Registration Certificate / ই-টিন সংশাপত্র</p>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium">
          This is to certify that <span className="font-bold text-gray-900">{data.nameEnglish}</span> is a registered taxpayer of the National Board of Revenue, under Taxes Circle-058, Taxes Zone-03. The unique Taxpayer Identification Number (TIN) database details are formulated below:
        </p>

        {/* Certificate Data Grid block */}
        <div className="border border-gray-400 rounded-lg overflow-hidden divide-y divide-gray-400 mb-8 font-semibold">
          <div className="grid grid-cols-4 divide-x divide-gray-400 py-3 px-4 bg-gray-50 text-base">
            <div className="col-span-1 text-gray-700 font-extrabold uppercase">TIN Number:</div>
            <div className="col-span-3 text-indigo-900 font-bold font-mono pl-4 tracking-widest">{tinNumberStr}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">Taxpayer Name (নাম):</div>
            <div className="col-span-3 text-gray-900 font-bold pl-4 uppercase">{data.nameEnglish} / {data.nameBangla}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">Father's Name (পিতা):</div>
            <div className="col-span-3 text-gray-900 pl-4">{data.fatherName}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">Mother's Name (মাতা):</div>
            <div className="col-span-3 text-gray-900 pl-4">{data.motherName}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">National ID (NID No):</div>
            <div className="col-span-3 text-red-700 font-mono font-bold pl-4 tracking-wide">{data.nidNo}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">Registered Office Address:</div>
            <div className="col-span-3 text-gray-900 pl-4">{data.address || 'N/A'}</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4">
            <div className="col-span-1 text-gray-700">Taxes Circle / Zone:</div>
            <div className="col-span-3 text-gray-900 pl-4">CIRCLE-058 (SALARY), TAXES ZONE-03, DHAKA</div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-400 py-2.5 px-4 bg-gray-50/5 text-[11px]">
            <div className="col-span-1 text-gray-700">Taxpayer Status:</div>
            <div className="col-span-3 text-emerald-800 font-bold pl-4">INDIVIDUAL (RESIDENT BANGLADESHI)</div>
          </div>
        </div>

        {/* NBR bottom note and barcodes stamp */}
        <div className="flex justify-between items-center bg-gray-50 p-4 border rounded-xl mb-12">
          <div className="space-y-1.5 text-[10px] text-gray-500 font-bold">
            <p className="text-gray-800">Note: This is a system-generated Certificate.</p>
            <p className="leading-relaxed">A certified taxpayer is obligated to file their Income Tax Return under Section 75 of the Income Tax Directive Act de-2023. File zero rates using Return form G-100 on time!</p>
          </div>
          
          <div className="flex flex-col items-center pl-4 border-l border-gray-300 shrink-0">
            <img src={BARCODE_MOCK_IMAGE} alt="TIN Barcode" className="w-52 h-8 opacity-80" />
            <p className="font-mono text-[8px] text-gray-400 mt-1 tracking-widest">{tinNumberStr}</p>
          </div>
        </div>

        {/* Footers */}
        <div className="flex justify-between items-end text-[10px] text-gray-600 font-bold">
          <div>
            <p>Verification Status: ACTIVE AND SECURE</p>
            <p className="text-[8px] text-gray-400 font-mono mt-0.5">SHA256 Code: tin_NBR_492049210_verified</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-full flex justify-center">
              <img src={SIGNATURE_SAMPLES[0]} alt="Sig" className="w-[120px] h-8 absolute -bottom-2 opacity-80" />
            </div>
            <div className="w-32 h-0.5 border-b border-gray-400 mb-1.5"></div>
            <p>Deputy Commissioner of Taxes</p>
            <p className="text-[8px] text-gray-400 font-mono">Taxes Circle 58, Taxes Zone 3</p>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
}

// 5. NID Server Copy lookup pull
export function ServerCopyDoc({ data, onBack }: { data: NIDInput; onBack: () => void }) {
  const customSignature = SIGNATURE_SAMPLES[1];

  return (
    <DocumentWrapper onBack={onBack} title={`NIDServerCopy-${data.nidNo}`}>
      <div className="width-container min-w-[750px] border border-gray-305 bg-gray-50 p-6 rounded-2xl relative text-xs leading-normal font-sans">
        
        {/* NID Official server-pull header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div className="flex gap-3 items-center">
            <img src={NID_BD_LOGO} alt="logo" className="w-12 h-12" />
            <div>
              <p className="text-sm font-extrabold text-emerald-900">জাতীয় পরিচয়পত্র যাচাইকরণ পোর্টাল</p>
              <p className="text-[10px] text-gray-500 font-mono">Election Commission Services (NID Server Pull Slip)</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg leading-none uppercase">
              STATUS: MATCHED FOUND
            </span>
            <p className="text-[8px] text-gray-400 mt-1 font-mono">PULL TIME: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Profile face and Core grids side-by-side */}
        <div className="grid grid-cols-4 gap-6 bg-white p-5 border rounded-2xl shadow-xs">
          
          <div className="col-span-1 flex flex-col items-center gap-3">
            <div className="w-32 h-[155px] border-2 border-emerald-600 rounded-lg overflow-hidden p-0.5 relative shrink-0">
              <img src={data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'} alt="NID portrait" className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-x-0 bottom-0 py-0.5 bg-emerald-990/40 text-center text-[7px] text-white">MATCH_CONFIRMED</div>
            </div>
            
            <div className="w-full text-center p-2 bg-gray-50 rounded-lg border">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Signature Stream</p>
              <img src={customSignature} alt="sig" className="w-24 h-6 opacity-75 mx-auto mt-1" />
            </div>
          </div>

          <div className="col-span-3">
            <h4 className="font-extrabold text-sm text-emerald-900 border-b pb-1.5 mb-3">Citizen Identification Registry Properties</h4>
            
            <table className="w-full text-left font-medium text-[11px] divide-y divide-gray-100">
              <tbody>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">National ID No:</td><td className="text-red-750 font-mono font-bold tracking-wider text-sm">{data.nidNo}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">Primary PIN Code:</td><td className="text-gray-900 font-mono font-bold">{data.pin || '1995281403212'}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">নাম (বাংলা):</td><td className="text-gray-900 font-bold">{data.nameBangla}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">Name (English):</td><td className="text-gray-900 font-mono uppercase font-bold text-xs">{data.nameEnglish}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">পিতার নাম:</td><td className="text-gray-900">{data.fatherName}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">মাতার নাম:</td><td className="text-gray-900">{data.motherName}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">Date of Birth:</td><td className="text-gray-900 font-mono font-bold">{data.dob}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">রক্তের গ্রুপ:</td><td className="text-red-650 font-bold">{data.bloodGroup || 'A+'}</td></tr>
                <tr className="py-2.5 flex"><td className="w-36 text-gray-400 font-semibold">Place of Birth:</td><td className="text-gray-900 uppercase font-bold">{data.birthPlace || 'DHAKA'}</td></tr>
                <tr className="py-2.5 flex border-b"><td className="w-36 text-gray-400 font-semibold">Full Permanent Address:</td><td className="text-gray-900 text-[10px] leading-relaxed">{data.address || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded extended EC properties tables */}
        <div className="grid grid-cols-2 gap-4 mt-4 font-semibold text-[10px] text-gray-600">
          <div className="bg-white p-4 border rounded-xl divide-y">
            <h5 className="font-bold text-gray-900 pb-1 text-xs">Voter Demographics Metadata</h5>
            <div className="py-1.5 flex justify-between"><span>Voter Area Code:</span><span className="text-gray-905">Uttara Ward-03 (B-15)</span></div>
            <div className="py-1.5 flex justify-between"><span>Voter Serial Code:</span><span className="text-gray-905">0912</span></div>
            <div className="py-1.5 flex justify-between"><span>Registry Volume reference:</span><span className="text-gray-905 font-mono">VOL_93_2019</span></div>
          </div>

          <div className="bg-white p-4 border rounded-xl divide-y">
            <h5 className="font-bold text-gray-900 pb-1 text-xs">Biometrics Database Matching Integrity</h5>
            <div className="py-1.5 flex justify-between"><span>Fingerprints Verified:</span><span className="text-emerald-600 font-bold">MATCHED (১০/১০)</span></div>
            <div className="py-1.5 flex justify-between"><span>Iris Scan Matches:</span><span className="text-emerald-600 font-bold">MATCHED (YES)</span></div>
            <div className="py-1.5 flex justify-between"><span>Face Matching Score:</span><span className="text-gray-905 font-mono text-emerald-600">98.5% APPROVED</span></div>
          </div>
        </div>

        {/* Bottom barcodes and certification disclaimer info */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl mt-4 text-[9px] text-gray-400 font-mono">
          <p>Verified on SECURE PORTAL API channels under Bangladesh Election Commission server logs.</p>
          <img src={BARCODE_MOCK_IMAGE} alt="Barcodes" className="w-36 h-6 shrink-0 opacity-60" />
        </div>
      </div>
    </DocumentWrapper>
  );
}

// 6. Zero Tax Return calculator Form
export function ZeroTaxDoc({ data, onBack }: { data: NIDInput; onBack: () => void }) {
  const returnYear = '2025-2026';
  return (
    <DocumentWrapper onBack={onBack} title={`ZeroTaxReceipt-${data.nidNo}`}>
      <div className="width-container min-w-[750px] border border-gray-400 bg-white p-8 rounded relative text-gray-950 font-serif leading-relaxed text-xs">
        
        {/* Tax Receipts crests headers */}
        <div className="text-center border-b pb-4 mb-4 font-sans space-y-1">
          <img src={OFFICIAL_GOVT_SEAL} alt="Seal" className="w-14 h-14 opacity-90 mx-auto" />
          <p className="text-sm font-extrabold text-gray-900">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
          <p className="text-[10px] font-bold text-gray-600">জাতীয় রাজস্ব বোর্ড, কর অঞ্চল-০৩, ঢাকা</p>
          <h3 className="text-base font-black text-gray-900 uppercase mt-2 tracking-tight">কর দাখিল প্রাপ্তি স্বীকারপত্র / Assessment Return Acknowledgement</h3>
          <p className="text-[10px] font-bold text-amber-800">আয়কর বিধিমালা, ২০২৩ (ফরম জি-১০০ অনুযায়ী জিরো রিটার্ন বিবরণী)</p>
        </div>

        {/* Receipt layouts */}
        <div className="border border-gray-400 rounded p-4 mb-6 leading-relaxed bg-gray-50/50">
          <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-3">
            <div><strong>কর বর্ষ / Assessment Year:</strong> <span className="font-sans font-bold">{returnYear}</span></div>
            <div><strong>দাখিলের তারিখ / Date of Filing:</strong> <span className="font-sans">31/05/2026</span></div>
          </div>

          <p className="mb-4">
            ট্যাক্স সার্কেল-০৫৮, কর অঞ্চল-০৩, ঢাকা কার্যালয়ে নিম্নোক্ত বিবরণী অনুযায়ী করদাতা কর্তৃক পেশকৃত আয়কর রিটার্ন সন্তোষজনকভাবে গৃহীত হয়েছে:
          </p>

          <table className="w-full text-left divide-y border-t border-b text-[11px] font-sans my-4">
            <tbody>
              <tr className="py-2 flex"><td className="w-48 font-bold">১. করদাতার নাম (Taxpayer Name):</td><td className="font-extrabold uppercase text-gray-900">{data.nameEnglish}</td></tr>
              <tr className="py-2 flex"><td className="w-48 font-bold">২. ই-টিন নম্বর (e-TIN Number):</td><td className="font-mono font-bold tracking-widest text-indigo-900">32194-{data.nidNo.substring(0, 4)}</td></tr>
              <tr className="py-2 flex"><td className="w-48 font-bold">৩. জাতীয় পরিচয়পত্র নম্বর (NID):</td><td className="font-mono">{data.nidNo}</td></tr>
              <tr className="py-2 flex"><td className="w-48 font-bold">৪. মোট ঘোষিত আয় (Declared Income):</td><td className="font-bold">৳ ০.০০ (শূণ্য) - Zero Taxable bracket BDT</td></tr>
              <tr className="py-2 flex"><td className="w-48 font-bold">৫. মোট কর পরিশোধ (Tax Paid):</td><td className="font-bold text-emerald-800">৳ ০.০০ (শূণ্য)</td></tr>
              <tr className="py-2 flex border-b"><td className="w-48 font-bold">৬. সম্পদের মোট পরিমাণ (Total Assets):</td><td>৳ ৩,৫০,০০০.০০ BDT (কর অব্যহতি প্রাপ্ত সীমাধীন)</td></tr>
            </tbody>
          </table>

          <p className="text-[10px] text-gray-500 italic mt-3 leading-relaxed">
            বিঃ দ্রঃ এটি আয়কর আইন ২০২৩ এর ধারা ৭৫ অনুযায়ী নির্ধারিত কর অঞ্চল কর্তৃক প্রদানকৃত স্বয়ংক্রিয় অনলাইন স্বীকৃতি পত্র। এর সাথে কোন প্রকার কর অনাদায়ী পত্র সংশ্লিষ্ট নয়।
          </p>
        </div>

        {/* Bottom signatory and official dynamic code overlay */}
        <div className="flex justify-between items-end mt-12 font-sans text-[10px]">
          <div>
            <p className="font-bold text-emerald-900">স্বয়ংক্রিয় জিরো রিটার্ন ফাইলিং অনলাইন আইডি:</p>
            <p className="font-mono text-gray-500 mt-0.5 uppercase tracking-wide">ZERO-TAX-RET-BD-92102</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-0.5 border-b border-gray-400 mb-2"></div>
            <strong>উপ-কর কমিশনার (সার্কেল-০৫৮)</strong>
            <p className="text-[8px] text-gray-400">কর অঞ্চল-০৩, ঢাকা সদর দপ্তর</p>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
}

// 7. Generic Certificate and Service order copy
export function GenericCertDoc({ data, serviceTitle, onBack }: { data: any; serviceTitle: string; onBack: () => void }) {
  const serialNo = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('bn-BD');
  return (
    <DocumentWrapper onBack={onBack} title={`${serviceTitle}-${serialNo}`}>
      <div className="width-container min-w-[750px] border border-gray-400 bg-white p-8 rounded relative text-gray-950 font-serif leading-relaxed text-xs">
        
        {/* Certificate Logo crests headers */}
        <div className="text-center border-b pb-4 mb-4 font-sans space-y-1">
          <img src={OFFICIAL_GOVT_SEAL} alt="Seal" className="w-14 h-14 opacity-90 mx-auto" />
          <p className="text-sm font-extrabold text-gray-900">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
          <p className="text-[10px] font-bold text-gray-600">ডিজিটাল নাগরিক তথ্য সেবা পোর্টাল</p>
          <h3 className="text-base font-black text-purple-950 uppercase mt-2 tracking-tight">{serviceTitle}</h3>
          <p className="text-[10px] font-bold text-gray-500">অনলাইন ডাটাবেজ ট্র্যাকিং এবং সার্টিফিকেট কপি</p>
        </div>

        {/* Dynamic content display table */}
        <div className="border border-gray-400 rounded p-5 bg-purple-50/10 mb-6 font-sans">
          <h4 className="font-bold text-gray-900 border-b pb-2 mb-3">সার্টিফিকেট বিবরণ (Certificate Ledger Details)</h4>
          <table className="w-full text-left divide-y text-xs">
            <tbody>
              <tr className="py-2.5 flex"><td className="w-48 text-gray-500 font-semibold">১. রেফারেন্স ট্র্যাকিং নম্বর:</td><td className="font-bold font-mono text-purple-900">{serialNo}</td></tr>
              <tr className="py-2.5 flex"><td className="w-48 text-gray-500 font-semibold">২. পোর্টালে দাখিলের তারিখ:</td><td className="font-bold">{dateStr} খ্রিঃ</td></tr>
              <tr className="py-2.5 flex"><td className="w-48 text-gray-500 font-semibold">৩. সেবা মডিউল টাইটেল:</td><td className="font-bold text-purple-900">{serviceTitle}</td></tr>
              
              {/* Loop and list any key-value input variables supplied */}
              {Object.entries(data || {}).map(([key, val], idx) => {
                if (typeof val === 'object' || key === 'isLockedSimulation') return null;
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <tr key={key} className="py-2.5 flex">
                    <td className="w-48 text-gray-500 font-semibold">{idx + 4}. {formattedKey}:</td>
                    <td className="font-mono text-gray-950 font-semibold">{String(val)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-[10px] rounded-lg border border-emerald-100 flex items-center gap-1.5 font-sans font-bold">
            <CheckCircle2 size={12} /> বাংলাদেশ دیجیتাল নাগরিক সার্ভিস নেটওয়ার্ক গেটওয়ে দ্বারা রিয়েল-টাইমে অনুমোদিত এবং ভেরিফায়েড।
          </div>
        </div>

        {/* Footer info and QR watermark sign */}
        <div className="flex justify-between items-end mt-12 font-sans text-[10px]">
          <div>
            <p className="font-bold text-purple-950">অনলাইন পোর্টাল গেটওয়ে রিসিভ আইডি:</p>
            <p className="font-mono text-gray-500 mt-0.5 uppercase tracking-wide">DIGI-SERV-{serialNo}</p>
          </div>
          
          <div className="text-center">
            <img src={SIGNATURE_SAMPLES[0]} alt="Signature" className="h-6 mx-auto opacity-85" />
            <div className="w-32 h-0.5 border-b border-gray-400 mb-1 mx-auto"></div>
            <strong>ডিজিটাল আইসিটি কর্নার উইং</strong>
            <p className="text-[8px] text-gray-400">সরকারি নাগরিক ভেরিফিকেশন গেটওয়ে ২০২২-২০২৬</p>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
}
