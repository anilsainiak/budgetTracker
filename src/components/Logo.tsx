import { PiggyBank } from 'lucide-react'
import React from 'react'

export const Logo = () => {
  return (
    <a href="/" className='flex items-center gap-2'>
        <PiggyBank className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5]' />
        <p className=' bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent'>
            BudgetTracker
        </p>
    </a>
  )
}

export const MobileLogo = () => {
  return (
    <a href="/" className='flex items-center gap-2'>
      <PiggyBank className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5] hidden  max-[400px]:block' />
        <p className=' bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent max-[540px]:text-2xl max-[400px]:hidden'>
            BudgetTracker
        </p>
    </a>
  )
}
