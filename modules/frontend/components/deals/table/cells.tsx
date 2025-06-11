import {ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {ExternalLink} from 'lucide-react'

export const PriceCell = ({rawAmount}: {rawAmount: string | null}) => {
  if (rawAmount === null) return <div className="w-full text-right">-</div>
  const amount = parseFloat(rawAmount)
  return <div className="w-full text-right font-medium">£{amount.toFixed(2)}</div>
}

export const PriceHeader = ({children}: {children: ReactNode}) => <div className="text-right">{children}</div>

export const ActionCell = ({url}: {url: string}) => (
  <div className="flex justify-center">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      title="Open item page"
      className="h-8 w-8"
    >
      <ExternalLink className="h-4 w-4" />
    </Button>
  </div>
)
