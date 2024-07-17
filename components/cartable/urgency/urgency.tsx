"use client"

import { useState, useEffect, useMemo } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

import type { UrgencyType } from "@/types/cartableType";

export default function Urgency({ defaultValue, onChange }: { defaultValue: UrgencyType, onChange: (value: UrgencyType) => void }): React.JSX.Element {

  const [urgencies, setUrgencies] = useState<UrgencyType[]>();
  const [urgency, setUrgency] = useState<UrgencyType>({ _id: "", title: "" });

  useEffect(() => {

    fetch("api/v1/urgencies")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setUrgencies(data);
      });
  }, [])

  useEffect(() => {
    urgencies && setUrgency(defaultValue);
  }, [urgencies])

  const handleChange = (event: SelectChangeEvent) => {
    const value = { _id: event.target.value, title: event.target.name };
    onChange(value);
  }

  return (
    <>
      <Select value={urgency._id} onChange={handleChange}>
        {
          urgencies?.map((urgency: UrgencyType) => (
            <MenuItem key={urgency._id} value={urgency._id}>{urgency.title}</MenuItem>
          ))
        }
      </Select>
    </>
  )
}