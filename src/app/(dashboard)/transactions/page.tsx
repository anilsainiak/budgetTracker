"use client";
import { DatePickerWithRange } from '@/components/ui/dateRangePicker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/Constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import TransactionTable from './_components/TransactionTable';

const TransactionPage = () => {
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date()
    })
    return (
        <>
            <div className="border-b border-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div>
                        <p className="text-3xl font-bold">
                            Transaction history
                        </p>
                    </div>
                    <DatePickerWithRange
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        onUpdate={(values) => {
                            const { from, to } = values;

                            if (!from || !to) return false;
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days`)
                                return false;
                            }
                            setDateRange({ from, to });
                            return true
                        }}
                    />
                </div>
            </div>
            <div className="container">
                <TransactionTable from={dateRange.from} to={dateRange.to}/>
            </div>
        </>
    )
}

export default TransactionPage