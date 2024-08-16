
import { Autocomplete as MUIAutoComplete, TextField, Box } from "@mui/material";

export default function AutoComplete({ options, defaultValueId, getSelectedId, inputProps }:
  { options: any, defaultValueId?: string | null, getSelectedId: (selectedId: string) => void, inputProps: { label: string, size?: "small" | "medium", width?: number } }): React.JSX.Element {

  return (
    <>
      <MUIAutoComplete options={options} autoHighlight freeSolo
        defaultValue={options?.length >= 1 && defaultValueId ? options.filter((option: any) => option._id === defaultValueId)[0] : null}
        getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
        onChange={(event, value) => getSelectedId(value?._id ?? value)}
        renderOption={(props, option) => {
          const { ...optionProps } = props;
          return (
            <Box key={option._id} component="li" {...optionProps}>
              <p>{option.firstName} {option.lastName}</p>
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