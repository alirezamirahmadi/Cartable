"use client"

import { useState, useEffect, memo } from "react";
import { Select, MenuItem, SelectChangeEvent, FormControl } from "@mui/material";

import type { UrgencyType } from "@/types/cartableType";

const Urgency = memo(({ defaultValue, onChange }:
  { defaultValue: UrgencyType, onChange: (value: UrgencyType) => void }): React.JSX.Element => {

  const [urgencies, setUrgencies] = useState<UrgencyType[]>();
  const [urgency, setUrgency] = useState<UrgencyType>({ _id: "", title: "" });

  useEffect(() => {
    loadUrgencyData();
  }, [])

  useEffect(() => {
    if (urgencies) {
      setUrgency(defaultValue._id ? defaultValue : urgencies[0]);
      !defaultValue._id && onChange(urgencies[0]);
    }
  }, [urgencies]);

  const loadUrgencyData = async () => {
    await fetch("api/v1/urgencies")
      .then(res => res.status === 200 && res.json())
      .then(data => setUrgencies(data));
  }

  const handleChange = (event: SelectChangeEvent) => {
    const value = { _id: event.target.value, title: event.target.name };
    onChange(value);
  }

  return (
    <>
      <FormControl>
        <Select value={urgency._id} onChange={handleChange} >
          {
            urgencies?.map((urgency: UrgencyType) => (
              <MenuItem key={urgency._id} value={urgency._id}>{urgency.title}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </>
  )
},
  (prevProps, nextProps) => prevProps.defaultValue === nextProps.defaultValue
)

export default Urgency;