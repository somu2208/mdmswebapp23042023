import { FormLabel, MenuItem, FormControl, Select } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  control: any;
  label: string;
  name: string;
  options: { label: string; value: any }[];
}

export default function SingleSelect({
  control,
  label,
  options,
  name,
  ...props
}: SelectProps) {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select {...props} {...field} fullWidth>
            {options?.map((item) => (
              <MenuItem value={item.value} key={item?.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
