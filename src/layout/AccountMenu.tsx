import {Logout, Person} from '@mui/icons-material'
import {Button, ListItemIcon, Menu, MenuItem} from '@mui/material'
import {useState} from 'react'

const AccountMenu = () => {
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		localStorage.clear()
		window.location.href = '/'
	}
	const user =
		JSON.parse(localStorage.getItem('userDetails')) &&
		JSON.parse(localStorage.getItem('userDetails'))[0]

	return (
		<div className=''>
			<div className='bg-white rounded-lg'>
				<Button
					startIcon={<Person />}
					className='font-medium'
					variant='outlined'
					onClick={handleClick}
					size='small'
				>
					<div className='flex gap-1'>
						<span>{user?.first_name}</span>
						<span>{user?.last_name}</span>
					</div>
				</Button>
			</div>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&::before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{horizontal: 'right', vertical: 'top'}}
				anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
			>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</div>
	)
}

export default AccountMenu
