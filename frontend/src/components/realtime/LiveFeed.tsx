import { useState,  } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Activity } from "lucide-react"
import { useSocket } from "../../hooks/useSocket"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { cn } from "../../utils/cn"

export function LiveFeed() {
  const [items, setItems] = useState<any[]>([
    { id: '1', category: 'MEDICAL', ward: 'Ward 1', timestamp: new Date().toISOString() },
    { id: '2', category: 'FOOD', ward: 'Ward 3', timestamp: new Date(Date.now() - 3600000).toISOString() }
  ])

  useSocket('new_report', (data) => {
    setItems((prev) => [data, ...prev].slice(0, 20))
  })

  return (
    <div className="h-[300px] flex flex-col">
      <h3 className="font-medium text-silver mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-orange" /> Live Feed
      </h3>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isOld = new Date().getTime() - new Date(item.timestamp).getTime() > 2 * 60 * 60 * 1000
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: isOld ? 0.4 : 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Card className={cn("p-3 flex items-center justify-between", isOld && "opacity-40")}>
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-silver-muted" />
                    <Badge variant="medium">{item.category}</Badge>
                    <span className="text-sm font-medium text-silver">{item.ward}</span>
                  </div>
                  <span className="text-[11px] text-silver-muted">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
