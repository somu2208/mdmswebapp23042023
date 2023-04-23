import {AiOutlinePlus as AddUser} from 'react-icons/ai'
import {BsSpeedometer as Tampers, BsTable as MeterTable} from 'react-icons/bs'
import {CgAssign as MeterAssign} from 'react-icons/cg'
import {
	MdDashboard as HomeDashboard,
	MdInfoOutline as MeterData,
	MdLocationOn as Geo,
	MdOutlineGrid4X4 as Grids,
	MdOutlineLeaderboard as HesDashboard,
	MdPerson as CustomersHome,
	MdSpeed as MetersHome,
	MdSupervisorAccount as CustomerTable,
	MdPaid as Prepaid,
} from 'react-icons/md'

const sideMenu = [
	{name: 'Dashboard', path: '/', icon: HomeDashboard},
	{name: 'HES', path: 'hes-dashboard', icon: HesDashboard},
	{
		name: 'Prepaid',
		icon: Prepaid,
		path: 'prepaid',
	},
	{
		name: 'Customers',
		icon: CustomersHome,
		path: 'customers',
		children: [
			{name: 'Add Customer', icon: AddUser, path: 'customers/add'},
			{
				name: 'Customers List',
				icon: CustomerTable,
				path: 'customers',
			},
		],
	},
	{
		name: 'Meters',
		icon: MetersHome,
		path: 'meters',
		children: [
			{name: 'Add Meter', icon: AddUser, path: 'meters/add'},
			{name: 'Deployed Meters', icon: MeterTable, path: 'meters'},
			{
				name: 'Meter Data',
				icon: MeterData,
				path: 'meters/data?phase=single-phase',
			},
			{
				name: 'Allocate Meter',
				icon: MeterAssign,
				path: 'meters/allocate',
			},
		],
	},
	{name: 'Grids', path: 'grids', icon: Grids},
	{name: 'Tampers', path: 'tampers', icon: Tampers},
	{
		name: 'Geographic Info System ',
		path: 'geographic-info-system',
		icon: Geo,
	},

]
export default sideMenu
