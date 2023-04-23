import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  InputBase,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Text from "components/typography/Text";

const Input = ({
  label = "",
  required = true,
  placeholder = "",
  className = "",
  ...props
}) => {
  return (
    <div>
      {label && (
        <Text.Label>
          {label}
          {required && (
            <span className="text-red-500 align-middle">{`  *`}</span>
          )}
        </Text.Label>
      )}
      <div>
        <TextField
          {...props}
          placeholder={label || placeholder}
          variant="outlined"
          fullWidth
          required={required}
          className={`bg-white  rounded-md ${className}`}
        />
      </div>
    </div>
  );
};
export default Input;

Input.Multiline = ({ label = "", ...props }) => {
  return <Input label={label} multiline {...props} minRows={4} />;
};

Input.Select = ({ label = "", required = true, children, ...props }) => {
  return (
    <Input label={label} required={required} select {...props}>
      {children}
    </Input>
  );
};

Input.Autocomplete = ({
  label = "",
  placeholder = "",
  options = [],
  required = true,
  getOptionLabel,
  value,
  ...props
}) => {
  return (
    <div className="">
      {label && (
        <Text.Label>
          {label}
          {required && (
            <span className="text-red-500 align-middle">{`  *`}</span>
          )}
        </Text.Label>
      )}
      <Autocomplete
        {...props}
        className="bg-white rounded-md"
        getOptionLabel={getOptionLabel}
        multiple
        options={options || []}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            required={required ? value?.length === 0 : false}
            placeholder={label}
            {...params}
          />
        )}
      />
    </div>
  );
};

interface RadioProps {
  options: { id?: string | number; value: any; name: any }[] | [];
  label: string;
  required?: boolean;
  children?: any;
  row: boolean;
  [x: string]: any;
}

Input.Radio = ({
  label = "",
  required = true,
  options = [],
  row = true,
  ...props
}: RadioProps) => {
  return (
    <div className="">
      {label && (
        <Text.Label>
          {label}
          {required && (
            <span className="text-red-500 align-middle">{`  *`}</span>
          )}
        </Text.Label>
      )}
      <RadioGroup {...props} row={row}>
        {options?.map((item, index) => (
          <FormControlLabel
            key={index}
            value={item.value}
            control={<Radio />}
            label={item.name}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

Input.WithButton = ({
  onChange,
  value,
  onSubmit,
  label = "",
  placeholder = "",
  icon: Icon,
  color = "secondary",
  ...props
}) => {
  return (
    <div
      className="bg-white w-full rounded-md border border-gray-400 border-opacity-50 shadow-sm flex items-center p-1"
      style={{ maxWidth: "400px" }}
    >
      <InputBase
        className="px-4 flex-grow"
        placeholder={placeholder}
        {...props}
        value={value}
        onChange={onChange}
      />
      <IconButton onClick={onSubmit}>
        <Icon color={color} fontSize="small" />
      </IconButton>
    </div>
  );
};
