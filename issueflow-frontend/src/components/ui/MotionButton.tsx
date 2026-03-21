"use client";

import { FC } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

interface Props {
    label: string
    variant?: 'primary' | 'secondary'
    classes?: string
    animate?: boolean
    delay?: number
    onClick?: () => void
}

const MotionButton: FC<Props> = ({ label, classes, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'group relative flex h-14 w-64 cursor-pointer items-center rounded-full border-none bg-zinc-900/50 p-1 outline-none backdrop-blur-sm transition-all hover:bg-zinc-900/80 dark:bg-zinc-100/10 dark:hover:bg-zinc-100/20',
                classes
            )}
        >
            <span
                className='absolute left-1 top-1 h-12 w-12 rounded-full bg-primary transition-all duration-500 ease-in-out group-hover:w-[calc(100%-8px)]'
                aria-hidden='true'
            ></span>

            <div className='relative z-10 flex w-full items-center'>
                <div className='flex h-12 w-12 items-center justify-center transition-all duration-500 group-hover:translate-x-1'>
                    <ArrowRight className='text-primary-foreground size-6' />
                </div>

                <span className='button-text ml-2 flex-1 pr-8 text-center text-lg font-medium tracking-tight text-foreground whitespace-nowrap transition-colors duration-500 group-hover:text-primary-foreground'>
                    {label}
                </span>
            </div>
        </button>
    )
}

export default MotionButton;
