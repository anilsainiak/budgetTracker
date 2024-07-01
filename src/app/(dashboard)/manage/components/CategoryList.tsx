import CreateCategoryDialog from '@/app/(dashboard)/_components/CreateCategoryDialog'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { PlusSquare, TrendingDown, TrendingUp } from 'lucide-react'
import React, { FC } from 'react'
import CategoryCard from './CategoryCard'

interface Props {
    type: TransactionType
}

const CategoryList: FC<Props> = ({ type }) => {
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories', type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json())
    });

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length>0;

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between gap-2'>
                        <div className="flex items-center gap-2">
                            {
                                type === 'expense' ? (
                                    <TrendingDown className='h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500' />
                                ) : (
                                    <TrendingUp className='h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500' />
                                )
                            }
                            <div>
                                {type === 'income' ? 'Incomes' : 'Expenses'} categories
                                <div className="text-sm text-muted-foreground">
                                    Sorted by name
                                </div>
                            </div>
                        </div>


                        <CreateCategoryDialog
                            type={type}
                            onSuccessCallback={() => categoriesQuery.refetch()}
                            trigger={
                                <Button className='gap-2 text-sm'>
                                    <PlusSquare className='h-4 w-4'/>
                                    Create category
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator/>
                {
                    !dataAvailable ? (
                        <div className="flex h-40 w-full flex-col items-center justify-center">
                            <p>
                                No <span className={cn("m-1",type==='income' ? 'text-emerald-500' : 'text-red-500')}>
                                    {type}
                                </span> categories yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Create one to get started
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {
                                categoriesQuery.data.map(category=>(
                                    <CategoryCard category={category} key={category.name}/>
                                ))
                            }
                        </div>
                    )
                }

            </Card>
        </SkeletonWrapper>
    )
}

export default CategoryList