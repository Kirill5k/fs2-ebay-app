import {ReactNode} from 'react'

export const PriceCell = ({rawAmount}: {rawAmount: string | null}) => {
  if (rawAmount === null) return <div className="max-w-20 text-right">-</div>
  const amount = parseFloat(rawAmount)
  return <div className="max-w-20 text-right font-medium">${amount.toFixed(2)}</div>
}

export const PriceHeader = ({children}: {children: ReactNode}) => <div className="max-w-[80px] text-right">{children}</div>
