import { useState } from 'react';
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "../components/layout/PageWrapper"
import { Input } from "../components/ui/Input"
import { VolunteerCard } from "../components/volunteers/VolunteerCard"
import { useVolunteers } from "../hooks/useVolunteers"
import { Spinner } from "../components/ui/Spinner"
import type { Volunteer } from '../types'
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"

const allSkills = ['MEDICAL', 'LOGISTICS', 'TEACHING', 'COOKING', 'LEGAL', 'TRANSLATION']

export function Volunteers() {
  const { data: volunteers, isLoading } = useVolunteers()
  const [search, setSearch] = useState("")
  const [activeSkills, setActiveSkills] = useState<string[]>([])
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null)

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const filteredVols = volunteers?.filter(v => {
    const matchSearch = ((v as any).name || "").toLowerCase().includes(search.toLowerCase())
    const matchSkills = activeSkills.length === 0 || activeSkills.some(s => v.skills.includes(s))
    return matchSearch && matchSkills
  }) || []

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 relative">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-muted" />
            <Input 
              className="pl-9" 
              placeholder="Search volunteers by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeSkills.includes(skill)
                    ? 'bg-orange border-orange text-charcoal'
                    : 'bg-transparent border-silver text-silver hover:border-orange'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVols.map((vol) => (
              <VolunteerCard 
                key={vol.id} 
                volunteer={vol} 
                onClick={() => setSelectedVol(vol)}
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedVol && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[400px] bg-charcoal border-l border-charcoal-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <button onClick={() => setSelectedVol(null)} className="absolute top-6 right-6 text-silver hover:text-white">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-medium text-silver mb-8">{(selectedVol as any).name || 'Volunteer Details'}</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-silver-muted mb-4">Availability</h3>
                  <Card className="p-4 flex items-center justify-center h-32 bg-charcoal-light">
                    <span className="text-silver-muted text-sm">7-day matrix active slots overview</span>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1">Contact</Button>
                  <Button variant="primary" className="flex-1">Assign to need</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
