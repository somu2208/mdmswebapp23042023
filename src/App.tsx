import {BrowserRouter as Router, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from 'layout/AppRouter'
import {ThemeProvider} from '@mui/material'
import theme from 'styles/theme'

import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StylesProvider from "@mui/styles/StylesProvider";
import jssPreset from "@mui/styles/jssPreset";


import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import Login from 'pages/login'
import QrLogin from 'pages/login/QrLogin'
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

function App() {
	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<AppRouter />
					<ToastContainer
						position='bottom-right'
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme='colored'
					/>
				</ThemeProvider>
				<ReactQueryDevtools />
			</QueryClientProvider>
		</Router>
	)
}

export default App
