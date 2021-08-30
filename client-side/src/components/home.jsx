import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { PieChart } from "../models/pieChart.jsx";
import BarChart from "../models/barChart.jsx";
import LineChart from "../models/lineChart.jsx";
import { SideBar } from "./sideBar.jsx";
import "./home.css";

export function Home() {
    const [dataLists, setData] = useState([]);
    const [fieldChosen, setFieldChoosed] = useState([]);
    const fields = [
        "intensity",
        "likelihood",
        "relevance",
        "year",
        "country",
        "topic",
        "region",
    ];
    useEffect(() => {
        // Call the Get Data Lists to visualize the data without any Filters.
        getDataLists("", "");
    });

    const getDataLists = (field, filter) => {
        // If the field has some value set it to variable fieldChosen.
        if (field === "remove") {
            setData([]);
        }
        if (field !== "") {
            setFieldChoosed(":(" + field + "=" + filter + ")");
        }
        // Call the Backend /getDatas call if the dataLists length is zero or field and filter is not empty.
        if (dataLists.length === 0 || (field !== "" && filter != "")) {
            try {
                axios({
                    method: "post",
                    url: "http://localhost:5000/getDatas",
                    params: {
                        field: field,
                        filter: filter,
                    },
                }).then(async (response) => {
                    await setData(response.data);
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div>
            <SideBar getDataLists={getDataLists} />
            <div className="container">
                <h1>BLACKCOFFER - DATA VISUALIZATION</h1>
                {dataLists.map((data, index) =>
                    data.length < 10 ? (
                        <div className="row text-center">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 graph">
                                <h3>
                                    {fields[index]}
                                    {fieldChosen}
                                </h3>
                                <PieChart
                                    data={data}
                                    outerRadius={100}
                                    innerRadius={50}
                                    key={index}
                                    index={index}
                                />
                            </div>
                        </div>
                    ) : data.length < 50 ? (
                        <div className="row text-center">
                            <div className="col-sm-3"></div>

                            <div className="col-sm-9 graph">
                                <h3>
                                    {fields[index]}
                                    {fieldChosen}
                                </h3>
                                <BarChart
                                    data={data}
                                    key={index}
                                    index={index}
                                    width={800}
                                    height={400}
                                    top={20}
                                    bottom={30}
                                    left={30}
                                    right={0}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="row text-center">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 graph">
                                <h3>
                                    {fields[index]}
                                    {fieldChosen}
                                </h3>
                                <LineChart
                                    data={data}
                                    key={index}
                                    width={800}
                                    height={400}
                                    top={20}
                                    bottom={30}
                                    left={30}
                                    right={0}
                                />
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
