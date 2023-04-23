import {
	FormControl,
	FormLabel,
	TextField as MuiTextField,
	TextFieldProps as MuiTextFieldProps,
} from '@mui/material'
import React from 'react'
import {Controller} from 'react-hook-form'

export interface MyTextFieldProps {
	control?: any
	label?: string
	name?: string
	muiProps?: MuiTextFieldProps
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}

export type TextFieldProps = MyTextFieldProps

export function TextField(props: TextFieldProps) {
	const {name, control, label, ...rest} = props

	return (
		<Controller
			control={props.control}
			name={props.name}
			defaultValue=''
			render={({field: {onChange, value}, fieldState: {error}}) => (
				<FormControl fullWidth>
					<FormLabel sx={{mb: 0.5, fontSize: '14px'}}>{props.label}</FormLabel>
					<MuiTextField
						variant='outlined'
						size='small'
						fullWidth
						name={props.name}
						onChange={(e) => {
							onChange(e)
							if (props.onChange) {
								props.onChange(e)
							}
						}}
						value={value}
						error={error ? true : false}
						helperText={error ? error.message : null}
						{...rest.muiProps}
					/>
				</FormControl>
			)}
		/>
	)
}
