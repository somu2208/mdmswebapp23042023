import Card from './DetailsCard';
import {add5Hr30Min} from 'utils';


const CardItems = ({c}) => (
	<>
			<Card.Item
				label='Service number'
				value={c?.usc_number}
				isLarge={true}
			/>
			<Card.Item label='Customer name' value={[c?.first_name, c?.last_name].join(' ')} />
			<Card.Item label='Current balance (INR)' value={c?.meter_serial_number?.current_balance?.toFixed(2) || 0.00} />
			<Card.Item label='Emergency credit (INR)' value={c?.meter_serial_number?.emergency_credit?.toFixed(2) || 100} />
			<Card.Item label='Meter serial number' value={c?.meter_serial_number?.meter_serial_number} />
			<Card.Item label='Meter id' value={c?.meter_serial_number?.meter_id} />
			<Card.Item label='Total power consumpiton (Kwh)' value={(c?.totalUnitConsumed/1000)?.toFixed(2) || 0.00} />
			<Card.Item label='Latest recharge amount (INR)' value={c?.last_recharge_amount?.toFixed(2) || 0.00} />
			<Card.Item label='Latest recharge date' value={c?.date_of_last_recharge && add5Hr30Min(c?.date_of_last_recharge)} />
			<Card.Item label='Total recharge amount (INR)' value={c?.total_amount_paid?.toFixed(2) || 0.00} />
	</>
)

export default CardItems;
