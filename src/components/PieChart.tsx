"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);



const options = {};

const PieChartBenef = ({ labels, colors, dataSet }: {
    labels: string[];
    colors: string[];
    dataSet: number[]
}) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: dataSet,
                backgroundColor: colors,
            },
        ],
    };
    return (

        <div className="w-full col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
            <Pie className="m-auto" data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartBenef;
