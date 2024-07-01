"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction"
import { User, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateTransaction = async (form: CreateTransactionSchemaType) => {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const user = (await currentUser()) as User;
    if (!user) {
        redirect('/sign-in');
    }

    const { amount, category, date, type, description } = parsedBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category
        }
    })

    if (!categoryRow) {
        throw new Error('category not found');
    }

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                type,
                date,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
                description: description || ''
            }
        }),

        //update month aggregate table
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === 'expense' ? amount : 0,
                income: type === 'income' ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === 'expense' ? amount : 0
                },
                income: {
                    increment: type === 'income' ? amount : 0
                }
            }
        }),

        //update year aggregate table
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === 'income' ? amount : 0,
                expense: type === 'expense' ? amount : 0
            },
            update: {
                expense: {
                    increment: type === 'expense' ? amount : 0
                },
                income: {
                    increment: type === 'income' ? amount : 0
                }
            }
        })
    ]);
}