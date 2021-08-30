import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./home.css";
export function SideBar(props) {
    const [filtersList, setFilters] = useState([]);
    const fields = [
        "Year",
        "Topic",
        "Sector",
        "Region",
        "Pestle",
        "Source",
        "Country",
        "Relevance",
    ];

    useEffect(() => {
        // If filtersList is initially Empty.
        if (filtersList.length === 0) {
            // Call the /getFilters path running on Backend server and get the details of all the filters from it.
            try {
                axios({
                    method: "get",
                    url: "http://localhost:5000/getFilters",
                    params: {},
                }).then(async (response) => {
                    await setFilters(response.data);
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

    return (
        <div>
            <ProSidebar className="sidebar">
                <Menu iconShape="rectangle" className="side">
                    <MenuItem
                        onClick={() => props.getDataLists("remove", "")}
                        className="head-bar"
                    >
                        Filters (Remove Selected)
                    </MenuItem>
                    {filtersList.map((filters, index) => (
                        <SubMenu title={fields[index]} className="value-bar">
                            <div className="filter-bar">
                                {filters.map((filter, index2) => (
                                    <MenuItem
                                        onClick={() =>
                                            props.getDataLists(
                                                fields[index],
                                                filter
                                            )
                                        }
                                    >
                                        {filter}
                                    </MenuItem>
                                ))}
                            </div>
                        </SubMenu>
                    ))}
                </Menu>
            </ProSidebar>
        </div>
    );
}
