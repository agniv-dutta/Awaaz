import { useState } from 'react';
import { useNeeds } from "../hooks/useNeeds"
import { PageWrapper } from "../components/layout/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarClose, SidebarOpen, X } from "lucide-react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { UrgencyBadge } from "../components/needs/UrgencyBadge"

export function NeedsMap() {
  const { data: needs } = useNeeds()
  const [leftOpen, setLeftOpen] = useState(true)
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null)
  
  const selectedNeed = needs?.find(n => n.id === selectedNeedId)

  return (
    <PageWrapper noPadding className="relative">
      <div className="absolute inset-0 bg-[#1A1A1A] flex items-center justify-center bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/72.8222,19.0435,11,0/1200x800?access_token=none')] bg-cover bg-center brightness-50">
         <span className="text-silver-muted">Live Map View</span>
      </div>

      <AnimatePresence>
        {leftOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-[300px] bg-charcoal border-r border-charcoal-border shadow-2xl z-10 flex flex-col"
          >
            <div className="p-4 border-b border-charcoal-border flex justify-between items-center">
              <h2 className="font-medium text-silver">Filters</h2>
              <button onClick={() => setLeftOpen(false)} className="text-silver hover:text-white">
                <SidebarClose className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <span className="text-[11px] text-silver-muted uppercase tracking-wider mb-2 block">Matching Needs</span>
              <div className="flex flex-col gap-2">
                {needs?.map(need => (
                  <Card 
                    key={need.id} 
                    className="p-3 cursor-pointer hover:border-orange transition-colors"
                    onClick={() => setSelectedNeedId(need.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-silver">{need.category}</span>
                      <UrgencyBadge urgency={need.urgency} />
                    </div>
                    <span className="text-[11px] text-silver-muted uppercase block">Ward {need.ward_id}</span>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!leftOpen && (
        <button 
          onClick={() => setLeftOpen(true)}
          className="absolute left-4 top-4 z-10 p-2 bg-charcoal rounded-md border border-charcoal-border text-silver shadow-lg"
        >
          <SidebarOpen className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence>
        {selectedNeed && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-[320px] bg-charcoal border-l border-charcoal-border shadow-2xl z-10 p-6 flex flex-col"
          >
             <button onClick={() => setSelectedNeedId(null)} className="absolute top-6 right-6 text-silver hover:text-white">
                <X className="w-5 h-5" />
             </button>
             <div className="mt-8 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-medium text-silver">{selectedNeed.category}</h2>
                  <UrgencyBadge urgency={selectedNeed.urgency} />
                </div>
                <div className="text-sm text-silver-muted">Ward {selectedNeed.ward_id}</div>
                <p className="text-sm text-silver mt-4 leading-relaxed">
                  {selectedNeed.description}
                </p>
                <div className="mt-auto pt-4 border-t border-charcoal-border">
                   <Button className="w-full">Dispatch Volunteers</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
