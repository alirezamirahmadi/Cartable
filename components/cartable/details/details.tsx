"use client";

import { useState } from "react";
import { Tabs, Tab } from "@mui/material";

import TabPanel, { setTabPanelProps } from "@/components/general/tabPanel/tabPanel";
import Circulation from "./circulation/circulation";
import Attachment from "@/components/general/attachment/attachment";

export default function Details({ refCollection, refDocument, place }:
  { refCollection: string, refDocument: string, place: "inbox" | "outbox" }): React.JSX.Element {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="گردش" {...setTabPanelProps(0)} />
        <Tab label="پیوست" {...setTabPanelProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Circulation refCollection={refCollection} refDocument={refDocument} place={place} onClose={() => { }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Attachment refCollection={refCollection} refDocument={refDocument} />
      </TabPanel>
    </>
  )
}