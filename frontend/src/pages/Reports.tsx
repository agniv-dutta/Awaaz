import { useState } from 'react';
import { PageWrapper } from "../components/layout/PageWrapper"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Spinner } from "../components/ui/Spinner"
import { UploadCloud } from "lucide-react"

export function Reports() {
  const [activeTab, setActiveTab] = useState<'submit' | 'ocr' | 'browse'>('submit')

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-medium text-silver">Reports</h1>
        
        <div className="flex gap-4 border-b border-charcoal-border pb-2">
          <button 
            className={`pb-2 -mb-2.5 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'submit' ? 'border-orange text-orange' : 'border-transparent text-silver-muted hover:text-silver'}`}
            onClick={() => setActiveTab('submit')}
          >
            Submit Report
          </button>
          <button 
             className={`pb-2 -mb-2.5 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ocr' ? 'border-orange text-orange' : 'border-transparent text-silver-muted hover:text-silver'}`}
             onClick={() => setActiveTab('ocr')}
          >
            Upload Document
          </button>
          <button 
            className={`pb-2 -mb-2.5 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'browse' ? 'border-orange text-orange' : 'border-transparent text-silver-muted hover:text-silver'}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Past
          </button>
        </div>

        {activeTab === 'submit' && <SubmitTab />}
        {activeTab === 'ocr' && <OCRTab />}
        {activeTab === 'browse' && <BrowseTab />}
      </div>
    </PageWrapper>
  )
}

function SubmitTab() {
  const categories = ['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'LEGAL', 'MENTAL_HEALTH', 'ELDERLY_CARE', 'OTHER']
  const [selectedCat, setSelectedCat] = useState('MEDICAL')
  const [urgency, setUrgency] = useState('HIGH')

  return (
    <div className="flex flex-col gap-6 mt-4">
      <Card className="p-6 flex flex-col gap-6">
        <div>
           <label className="text-sm font-medium text-silver mb-3 block">Category</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCat(cat)}
                 className={`py-3 px-4 rounded-lg text-sm transition-colors border ${selectedCat === cat ? 'border-orange bg-[#FF9E0010] text-orange' : 'border-charcoal-border bg-charcoal text-silver hover:border-silver'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        <div>
           <label className="text-sm font-medium text-silver mb-2 block">Description</label>
           <textarea 
             className="w-full min-h-[120px] rounded-lg border border-charcoal-border bg-charcoal p-3 text-sm text-silver focus:outline-none focus:ring-2 focus:ring-orange placeholder:text-silver-muted"
             placeholder="Describe the need..."
           />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
             <label className="text-sm font-medium text-silver mb-2 block">Ward</label>
             <select className="w-full h-10 rounded-lg border border-charcoal-border bg-charcoal px-3 text-sm text-silver focus:outline-none focus:ring-2 focus:ring-orange">
               <option>Ward 1 - Dharavi</option>
               <option>Ward 2 - Kurla</option>
             </select>
          </div>
          <div className="flex-1">
             <label className="text-sm font-medium text-silver mb-2 block">Urgency</label>
             <div className="flex gap-2">
               {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(u => (
                 <button
                   key={u}
                   onClick={() => setUrgency(u)}
                   className={`flex-1 py-2 rounded-full text-xs font-semibold ${urgency === u ? 'bg-orange text-charcoal' : 'bg-charcoal border border-charcoal-border text-silver hover:border-silver'}`}
                 >
                   {u}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <Button className="w-full mt-4">Submit Report</Button>
      </Card>
    </div>
  )
}

function OCRTab() {
  const [isHover, setIsHover] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [text, setText] = useState("")

  const handleSimulate = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setText("Extracted: Needs 50 blankets and medical supply kit near main crossroad.")
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div 
        className={`w-full h-64 border-2 border-dashed rounded-[14px] flex flex-col justify-center items-center cursor-pointer transition-colors ${isHover ? 'border-orange bg-[#FF9E0006]' : 'border-[#FF9E0059] bg-transparent'}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleSimulate}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <span className="text-orange font-medium animate-pulse">Extracting needs...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-orange mb-4 opacity-50" />
            <span className="text-silver font-medium">Drop PDF or image here</span>
            <span className="text-silver-muted text-sm mt-1">.pdf, .jpg, .png</span>
          </>
        )}
      </div>

      {text && (
        <Card className="p-4 flex flex-col gap-4">
           <label className="text-sm font-medium text-silver">Extracted Content</label>
           <textarea 
             className="w-full min-h-[100px] rounded-lg border border-charcoal-border bg-charcoal p-3 text-sm text-silver focus:outline-none focus:ring-2 focus:ring-orange"
             value={text}
             onChange={e => setText(e.target.value)}
           />
           <Button>Confirm & Submit</Button>
        </Card>
      )}
    </div>
  )
}

function BrowseTab() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="p-4 flex justify-between items-center">
          <div className="flex flex-col gap-1">
             <span className="text-silver text-sm font-medium">Report #{i}293</span>
             <span className="text-xs text-silver-muted">Today at 10:45 AM</span>
          </div>
          <div className="text-[11px] px-2 py-0.5 rounded-full border border-silver text-silver tracking-wider uppercase font-semibold">
            PENDING
          </div>
        </Card>
      ))}
    </div>
  )
}
