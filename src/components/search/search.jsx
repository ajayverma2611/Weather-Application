import React, { useState } from "react";
import { AsyncPaginate } from 'react-select-async-paginate';
import { GEO_API_URL, geoApiOptions } from "../../api";
import "./Search.css";

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

    const loadOptions = async (inputValue) => {
        try {
            const response = await fetch(
                `${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${inputValue}`,
                geoApiOptions
            );
            const result = await response.json();

            return {
                options: result.data.map((city) => ({
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.region}, ${city.country}`
                })),
            };
        } catch (err) {
            console.error(err);
            return { options: [] };
        }
    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <div className="search-container">
            <AsyncPaginate
                className="search-input"
                classNamePrefix="search"
                placeholder="Search for city..."
                debounceTimeout={600}
                value={search}
                onChange={handleOnChange}
                loadOptions={loadOptions}
                styles={{
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                            ? 'transparent'
                            : provided.backgroundColor,
                        color: state.isSelected
                            ? 'inherit'
                            : provided.color,
                        '&:active': {
                            backgroundColor: 'transparent'
                        }
                    })
                }}

            />
        </div>
    );
};

export default Search;