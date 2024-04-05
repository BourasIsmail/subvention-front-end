"use client"

import React from 'react'
import { Progress } from "@/components/ui/progress"


const progress = () => {
    const [progress, setProgress] = React.useState(13)
    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])
    return (
        <div className='m-auto'>
            <Progress value={progress} className="w-[60%]" />
        </div>
    )
}

export default progress
