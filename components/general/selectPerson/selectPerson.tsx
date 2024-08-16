
// import { Autocomplete, TextField, Box } from "@mui/material";

// import type { PersonType } from "@/types/personType";

// export default function SelectPerson({ persons, defaultValueId, getSelectedId, inputProps }:
//   { persons: PersonType[], defaultValueId?: string | null, getSelectedId: (selectedId: string) => void, inputProps: { label: string, size?: "small" | "medium", width?: number } }): React.JSX.Element {

//   // const [persons, setPersons] = useState<PersonType[]>([]);

//   // useEffect(() => {
//   //   loadPersonData();
//   // }, []);

//   // const loadPersonData = async () => {
//   //   await fetch(`api/v1/persons?limited=true`)
//   //     .then(res => res.status === 200 && res.json())
//   //     .then(data => console.log(data));
//   // }

//   return (
//     <>
//       <Autocomplete options={persons} autoHighlight freeSolo
//         defaultValue={persons?.length >= 1 && defaultValueId ? persons.filter((person: any) => person._id === defaultValueId) : null}
//         getOptionLabel={(option: any) => {
//           getSelectedId(option._id);
//           return `${option.firstName} ${option.lastName}`
//         }}
//         renderOption={(props, option) => {
//           const { ...optionProps } = props;
//           return (
//             <Box key={option._id} component="li" {...optionProps}>
//               <p>{option.firstName} {option.lastName}</p>
//             </Box>
//           )
//         }}
//         renderInput={(params) => (
//           <TextField {...params} label={inputProps.label} size={inputProps.size} sx={{ width: inputProps.width }}
//             inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
//           />
//         )}
//       />
//     </>
//   )
// }


import { Autocomplete, TextField, Box } from "@mui/material";

export default function SelectPerson({ options, defaultValueId, getSelectedId, inputProps }:
  { options: any, defaultValueId?: string, getSelectedId: (selectedId: string) => void, inputProps: { label: string, size?: "small" | "medium", width?: number } }): React.JSX.Element {

  return (
    <>
      <Autocomplete options={options} autoHighlight freeSolo 
      defaultValue={options?.length >= 1 && defaultValueId ? options.filter((option: any) => option._id === defaultValueId)[0] : null}
        getOptionLabel={(option: any) => {
          getSelectedId(option._id);
          return `${option.firstName} ${option.lastName}`
        }}
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