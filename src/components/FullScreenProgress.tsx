import CircularProgress from '@mui/material/CircularProgress'

export default function CustomProgress() {
	return (
		<main className='h-screen w-screen bg-black z-50  grid place-items-center fixed top-0 left-0 bg-opacity-10'>
			<div className='bg-white h-64 w-64 rounded-xl shadow-md grid place-items-center'>
				<div className='absolute'>
					<CircularProgress color='secondary' size={160} thickness={2} />
				</div>
				<img
					src='/images/logo-primary.svg'
					alt='H'
					className='h-16 w-16 block relative top-0  left-0 '
				/>
			</div>
		</main>
	)
}
