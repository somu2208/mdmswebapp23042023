import {Close} from '@mui/icons-material'
import {Alert, Button, CircularProgress, IconButton} from '@mui/material'
import {postMeterOperations} from 'api/services/meters'
import Card from 'pages/customers/details/components/DetailsCard'
import {useEffect} from 'react'
import {useMutation} from 'react-query'
import {toast} from 'react-toastify'

const MeterOperations = ({details}) => {
	
useEffect(() => {
		if (!localStorage) {
			toast.error('You are not logged in')
			window.location.href = '/'
		}
	})

	return (
		<Card title='Meter operations'>
		{/* {localStorage.getItem('user_role') === 'admin' && ( */}
			<section className='flex gap-4 pb-4'>
				<OperationButton label='Load Connect' id={16} details={details} />
				<OperationButton label='Load Disconnect' id={49} details={details} />
			</section>
			{/* )} */}
			<section className='flex gap-4'>
				<OperationButton
					label='Read Latest Instantaneous Data'
					id={1}
					details={details}
				/>
				<OperationButton
					label='Read Latest Block Load Data'
					id={2}
					details={details}
				/>
				<OperationButton
					label='Read Latest Daily Load Data'
					id={4}
					details={details}
				/>
				<OperationButton
					label='Read Latest Billing profile data'
					id={6}
					details={details}
				/>
			</section>
		</Card>
	)
}

export default MeterOperations

const OperationButton = ({label, id, details}) => { 
	const {mutate, isLoading, isError} = useMutation(postMeterOperations, {
		onSuccess: () => {
			if(id === 16){
			toast(
				// 'You request for Connect Meters has been placed, You will receive notification once the request got processed and closed, Thank you',
				'Your request for Load Connect has been placed',
				{
					position: 'top-center',
					autoClose: false,
					className: 'w-[500px] flex items-baseline justify-center',
					closeButton: () => (
						<IconButton>
							<Close />
						</IconButton>
					),
				})
			} else if(id === 49){
				toast(
					'Your request for Load Disconnect has been placed',
					{
						position: 'top-center',
						autoClose: false,
						className: 'w-[500px] flex items-baseline justify-center',
						closeButton: () => (
							<IconButton>
								<Close />
							</IconButton>
						),
					})
				}else if(id === 1){
					toast(
						'Your request for Latest Instantaneous Data has been placed',
						{
							position: 'top-center',
							autoClose: false,
							className: 'w-[500px] flex items-baseline justify-center',
							closeButton: () => (
								<IconButton>
									<Close />
								</IconButton>
							),
						})
					}else if(id === 2){
						toast(
							'Your request for Read Latest Block Load Data has been placed',
							{
								position: 'top-center',
								autoClose: false,
								className: 'w-[500px] flex items-baseline justify-center',
								closeButton: () => (
									<IconButton>
										<Close />
									</IconButton>
								),
							})
						}else if(id === 4){
							toast(
								'Your request for Read Latest Daily Load Data has been placed',
								{
									position: 'top-center',
									autoClose: false,
									className: 'w-[500px] flex items-baseline justify-center',
									closeButton: () => (
										<IconButton>
											<Close />
										</IconButton>
									),
								})
							}else if(id === 6){
								toast(
									'Your request for Read Latest Billing profile data has been placed',
									{
										position: 'top-center',
										autoClose: false,
										className: 'w-[500px] flex items-baseline justify-center',
										closeButton: () => (
											<IconButton>
												<Close />
											</IconButton>
										),
									})
								}
		},
	})
	const handleSubmit = () => {
		mutate({
			readWritePatternId: id,
			csn: details.csn,
			meterId: details.meterId,
		})
	}
	return (
		<div>
			
			<Button
				onClick={handleSubmit}
				variant='outlined'
				color='secondary'
				disabled={isLoading}
				endIcon={isLoading ? <CircularProgress size={20} /> : null}
			>
				{label}
			</Button>
			{isError && <Alert severity='error'>{`Error submitting ${label}`}</Alert>}
		</div>
	)
}
