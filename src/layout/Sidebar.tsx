import { ExpandLess, ExpandMore } from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import {
	Collapse,
	InputBase,
	IconButton as MuiIconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar as MuiAppBar,
	Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate, useResolvedPath, useLocation } from 'react-router-dom'
import React from "react";
import styled, { css } from "styled-components/macro";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
//import './scroll.css'
import sideMenu from './sideMenu'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import AccountMenu from './AccountMenu'
import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import { Search as SearchIcon } from "react-feather";

const drawerWidth = 258;


const baseScrollbar = css`
  background-color: #233044;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Scrollbar = styled.div`
  ${baseScrollbar}
`;

const PerfectScrollbar = styled(ReactPerfectScrollbar)`
  ${baseScrollbar}
`;

const Items = styled.div`
  padding-top: 10;
  padding-bottom: 10;
  color:red;
  text:sec
`;

const AppBar = styled(MuiAppBar)`
  background: white;
  color: black;

`;


const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: #FFF;
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: #E4E4E4;
  }
	display: block;
  
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: #424242;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 48px;
    width: 160px;
  }
`;


const Sidebar = (props) => {
	const [showLabels, setShowLabels] = useState<boolean>(true)
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up("md"));
	const ScrollbarComponent = matches ? PerfectScrollbar : Scrollbar;

	const location = useLocation();
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	
	const container = window !== undefined ? () => window().document.body : undefined;
	

	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				{/* header or appbar */}
				<AppBar
					position="fixed"
					sx={{
						width: { sm: `calc(100% - ${drawerWidth}px)` },
						ml: { sm: `${drawerWidth}px` },
					}}

					//to remove box shadow use elevation={0}
					elevation={0}
				>
					<Toolbar>
						<Grid container alignItems="center">
							<Grid item sx={{ display: { xs: "block", md: "none" } }}>
								<IconButton className="header_menu_togl"
									color="inherit"
									aria-label="Open drawer"
									onClick={handleDrawerToggle}
									size="large"
								>
									<MenuIcon />
								</IconButton>
							</Grid>
							<Grid item>
								<Search>
									<SearchIconWrapper>
										<SearchIcon />
									</SearchIconWrapper>
									<Input placeholder={"Search"} />
								</Search>
							</Grid>
							<Grid item xs />
							<Grid item className="navbar_icon_t">
								{/* //<AccountMenu /> */}
								<NavbarMessagesDropdown />
								<NavbarNotificationsDropdown />
								<NavbarLanguagesDropdown />
								<NavbarUserDropdown />
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				{/*end of  header or appbar */}

				<Box 
					component="nav"
					sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
					aria-label="mailbox folders"
					className="ibotside_nar123"
				>
					{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
					<Drawer 
						container={container}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
						sx={{
							display: { xs: 'block', sm: 'none' },
							'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
						}}
					>
						<ScrollbarComponent className=" text-secondary overflow-y-auto flex-shrink-0">
							<Grid className="desktop-logo">
								<img
									src='/logo.png'
									className={`flex h-14 ${showLabels ? 'w-full' : 'w-16'
										} object-contain`}
									alt=''
								/>
							</Grid>
							
							<Grid className='mo_menulist'>
								<List disablePadding>
									<Items>
										{sideMenu.map((item) => (
											<SidebarItem
												showLabels={showLabels}
												title={item.name}
												icon={item.icon}
												hasChildren={!!item.children?.length}
												items={item?.children}
												path={item.path}

											/>
										))}
									</Items>
								</List>
							</Grid>
						</ScrollbarComponent>
					</Drawer>
					<Drawer
						variant="permanent"  className="ibotside_nar"
						sx={{
							display: { xs: 'none', sm: 'block' },
							'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
						}}
						open
					>
						<ScrollbarComponent className="text-secondary overflow-y-auto flex-shrink-0">
							<Grid className="desktop-logo">
								<img
									src='/logo.png'
									className={`flex h-14 ${showLabels ? 'w-full' : 'w-16'
										} object-contain`}
									alt=''
								/>
							</Grid>
							
							<Grid >
								<List disablePadding>
									<Items>
										{sideMenu.map((item) => (
											<SidebarItem
												showLabels={showLabels}
												title={item.name}
												icon={item.icon}
												hasChildren={!!item.children?.length}
												items={item?.children}
												path={item.path}

											/>
										))}
									</Items>
								</List>
							</Grid>
						</ScrollbarComponent>
					</Drawer>
				</Box>
				<Box
					component="main"
					sx={{ pl: 1, mt: 32, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
				></Box>
			</Box>
		</>		
	)
}

export default Sidebar

interface IListItem {
	hasChildren: boolean
	title: String
	items?: IListItem[] | undefined | any
	icon: any
	path?: string
	showLabels: boolean
}

const SidebarItem = ({
	hasChildren,
	title,
	items,
	icon: Icon,
	path,
	showLabels = true,
}: IListItem) => {
	let mypath = path || '/'
	let resolved = useResolvedPath(mypath)

	let match = useMatch({ path: resolved.pathname, end: true })

	const navigate = useNavigate()
	const [open, setOpen] = useState<boolean>(false)
	const handleClick = () => {

		if (hasChildren) {
			setOpen(!open)
		}
		!hasChildren && navigate(path)
	}

	return (
		<>
			<ListItemButton
				className={
					match ? 'active-menu' : ''
				}
				onClick={handleClick}
			>
				<ListItemIcon
					sx={{
						margin: 0
					}}
					className={`${match ? 'active-menu' : ''}`}
				>
					<Icon />
				</ListItemIcon>
				{showLabels && <ListItemText primary={title} />}
				{hasChildren && showLabels && (
					<>{open ? <ExpandLess /> : <ExpandMore />}</>
				)}
			</ListItemButton>
			{hasChildren && (
				<div className='pl-3'>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<List component='div' disablePadding>
							{items.map((child) => (
								<SidebarItem
									showLabels={showLabels}
									hasChildren={false}
									path={child.path}
									title={child.name}
									icon={child.icon}
								/>
							))}
						</List>
					</Collapse>
				</div>
			)}
		</>
	)
}


