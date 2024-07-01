"use client";
import { DatePickerWithRange } from '@/components/ui/dateRangePicker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/Constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { FC, useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';

interface Props {
    userSettings: UserSettings
}

const Overview: FC<Props> = ({ userSettings }) => {
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date()
    })
    return (
        <>
            <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
                <h2 className="text-3xl font-bold">Overview</h2>
                <div className="flex items-center gap-3">
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
                            return true;
                        }}
                    />
                </div>
            </div>
            <div className="container flex w-full flex-col gap-2">
                <StatsCards
                    userSettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />

                <CategoriesStats
                    userSettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />
            </div>
        </>
    );
}

export default Overview