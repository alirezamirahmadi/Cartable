"use client"

import { useState, useEffect } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

import type { Urgency as UrgencyType } from "@/types/cartableType";

export default function Urgency({ onChange }: { onChange: (value: UrgencyType) => void }): React.JSX.Element {

  const [urgencies, setUrgencies] = useState<UrgencyType[]>();
  const [urgency, setUrgency] = useState<UrgencyType>({ _id: "", title: "" });

  useEffect(() => {
    fetch("api/v1/urgencies")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setUrgencies(data);
        setUrgency(data[0]);
      });
  }, [])

  useEffect(() => {
    onChange(urgency);
  }, [urgency])

  const handleChange = (event: SelectChangeEvent) => {
    setUrgency({ _id: event.target.value, title: event.target.name });
  }

  return (
    <>
      <Select value={urgency._id} onChange={handleChange}>
        {
          urgencies?.map((urgency: UrgencyType) => (
            <MenuItem value={urgency._id}>{urgency.title}</MenuItem>
          ))
        }
      </Select>
    </>
  )
}