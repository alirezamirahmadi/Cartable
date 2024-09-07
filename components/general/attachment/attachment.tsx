"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Box, IconButton, Typography, Divider, TextField, useTheme } from "@mui/material";
import ReactDataTable, { type ColumnType } from "react-datatable-responsive";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as shamsi from "shamsi-date-converter";

const Snack = dynamic(() => import("../snack/snack"));
import ModifyButtons from "../modifyButtons/modifyButtons";
import VisuallyHiddenInput from "../visuallyHiddenInput/visuallyHiddenInput";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import { useAppSelector } from "@/lib/hooks";
import type { SnackProps } from "@/types/generalType";
import type { AttachmentType } from "@/types/generalType";

export default function Attachment({ refCollection, refDocument }: { refCollection: string, refDocument: string }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const theme = useTheme();
  const [file, setFile] = useState<File>();
  const [attachments, setattachments] = useState<AttachmentType[]>([]);
  const [description, setDescription] = useState<string>("");
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const columns: ColumnType[] =
    [
      { field: { title: "_id" }, label: "ID", options: { display: false } },
      { field: { title: "title" }, label: "عنوان" },
      { field: { title: "description" }, label: "توضیحات" },
      {
        field: { title: "createDate" }, label: "زمان ایجاد", kind: "component", options: {
          component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{shamsi.gregorianToJalali(value).join("/")} {new Date(value).toLocaleTimeString()}</Typography>)
        }
      },
      {
        field: { title: "creator" }, label: "ایجاد کننده", kind: "component", options: {
          component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{`${rowData.person.firstName} ${rowData.person.lastName}`}</Typography>)
        }
      },
      {
        field: { title: "path" }, label: "دانلود", kind: "component", options: {
          component: (value, onChange, rowData) => (
            <IconButton>
              <Link href={rowData.path} target="_blank">
                <CloudDownloadIcon />
              </Link>
            </IconButton>
          )
        }
      },
      {
        field: { title: "modify" }, label: "حذف", kind: "component", options: {
          component: (value, onChange, rowData) => (<ModifyButtons omit={me.permissions.includes("/attachment.delete")} omitMessage={`آیا از حذف ${rowData?.title} مطمئن هستید؟`} rowData={rowData} onAction={handleAction} />)
        }
      },
    ];

  useEffect(() => {
    loadAttachmentData();
  }, [])

  const loadAttachmentData = async () => {
    refCollection && refDocument &&
      fetch(`api/v1/attachment?refCollection=${refCollection}&refDocument=${refDocument}`)
        .then(res => res.status === 200 && res.json())
        .then(data => setattachments(data));
  }

  const handleAction = (data: any, action: string) => {
    action === "Delete" && fetch(`api/v1/attachment/${data._id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 200) {
          setSnackProps({ context: "فایل با موفقیت حذف شد", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          loadAttachmentData();
        }
      })
  }

  const handleUploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file ?? "");
    formData.append("description", description);
    formData.append("refCollection", refCollection);
    formData.append("refDocument", refDocument);

    await fetch(`api/v1/attachment`, {
      method: "POST",
      body: formData,
    })
      .then(res => {
        if (res.status === 201) {
          setDescription("");
          setFile(undefined);
          setSnackProps({ context: "فایل با موفقیت ارسال شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          loadAttachmentData();
        }
      })
  }

  return (
    <>
      <Box>
        {me.permissions.includes("/attachment.new") &&
          <>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", mb: 2 }}>
              <IconButton component="label" >
                <AttachFileIcon />
                <VisuallyHiddenInput type="file" onChange={event => setFile(event.target.files ? event.target.files[0] : undefined)} />
              </IconButton>
              {file &&
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField value={description} onChange={event => setDescription(event.target.value)} sx={{ width: { xs: 150, md: 500, lg: 700 } }} multiline variant="outlined" size="small" label="توضیحات" />
                  <IconButton onClick={handleUploadFile}>
                    <CloudUploadIcon />
                  </IconButton>
                </Box>
              }
            </Box>
            {file && <Typography variant="body2" sx={{ mx: 5, mb: 1 }}>{`عنوان فایل: ${file?.name}`}</Typography>}
            <Divider variant="middle" />
          </>
        }
        {me.permissions.includes("/attachment") && <ReactDataTable rows={attachments} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />}
      </Box>

      <Snack {...snackProps} />
    </>
  )
}