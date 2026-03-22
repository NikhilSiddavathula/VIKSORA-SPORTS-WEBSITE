// client/src/components/common/CountryDropdown.jsx
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { Country, State } from 'country-state-city';

const CountryDropdown = ({ country, state, onCountryChange, onStateChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    // Get all countries
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    // Get states for selected country
    if (country) {
      const countryStates = State.getStatesOfCountry(country);
      setStates(countryStates);
    } else {
      setStates([]);
    }
  }, [country]);

  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        select
        id="country"
        label="Country"
        name="country"
        value={country}
        onChange={onCountryChange}
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            height: 56,
            '& fieldset': {
              borderColor: 'primary.main',
            },
            '&:hover fieldset': {
              borderColor: 'primary.dark',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      >
        {countries.map((country) => (
          <MenuItem key={country.isoCode} value={country.isoCode}>
            {country.name}
          </MenuItem>
        ))}
      </TextField>
      {country === 'IN' && (
        <TextField
          margin="normal"
          required
          fullWidth
          select
          id="state"
          label="State"
          name="state"
          value={state}
          onChange={onStateChange}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              height: 56,
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        >
          {states.map((state) => (
            <MenuItem key={state.isoCode} value={state.isoCode}>
              {state.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
};

export default CountryDropdown;