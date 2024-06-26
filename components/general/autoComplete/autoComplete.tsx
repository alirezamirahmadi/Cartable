
import { Autocomplete as MUIAutoComplete, TextField, Box } from "@mui/material";

export default function AutoComplete({ options, getSelectedId, inputProps }:
  { options: any, getSelectedId: (selectedId: string) => void, inputProps: { label: string, size?: "small" | "medium", width?: number } }): React.JSX.Element {
  return (
    <>
      <MUIAutoComplete options={options} autoHighlight freeSolo
        getOptionLabel={(option: any) => {
          getSelectedId(option._id);
          return option.firstName
        }}
        renderOption={(props, option) => {
          const { ...optionProps } = props;
          return (
            <Box key={option._id} component="li" {...optionProps}>
              <p>{option.firstName}</p>
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField {...params} label={inputProps.label} size={inputProps.size} sx={{ width: inputProps.width }}
            inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
          />
        )}
      />
    </>
  )
}