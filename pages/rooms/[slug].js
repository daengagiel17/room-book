import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import useSWR from 'swr';
import DataTime from '@/components/DataTime';
import Booking from '@/components/Booking';

const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
};

export default function Room() {
	const router = useRouter();
	const { slug } = router.query;
	const { data: roomData, error, mutate } = useSWR(`/api/rooms/${slug}`, fetcher,
		{
			refreshInterval: 5000, // Refresh every 10 seconds (adjust this value as needed)
		}
	);
	
	const [currentMeeting, setCurrentMeeting] = useState(null);
	const [nextMeeting, setNextMeeting] = useState(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (roomData) {
				const now = moment();
				
				const currentSchedule = roomData.schedule.find(schedule => {
					return schedule.id && moment(schedule.start).isSameOrBefore(now) && moment(schedule.end).isAfter(now)
				})
	
				const nextSchedule = roomData.schedule.find(schedule => {
					return schedule.id && moment(schedule.start).isAfter(now) && moment(schedule.end).isAfter(now)
				})
	
				setCurrentMeeting(currentSchedule);
				setNextMeeting(nextSchedule);
			}	
		}, 1000);

		return () => clearInterval(intervalId); // Cleanup interval on component unmount
}, [roomData]);

	return (
		<div className="bg-cover bg-[url('/bg-mms.png')] h-screen text-primary-3 pt-6 pb-20 px-10">
			{/* Header */}
			<div className='flex justify-center gap-4 items-center w-full'>
				<div className='font-bold text-lg'>
					{roomData?.name}
				</div>
				<div className='border-t-[1px] border-white flex-auto' />
			</div>
			<div className='h-full flex flex-col justify-between'>
				{/* Current Date Time and Action */}
				<div>
					{/* Current Date Time */}
					<div className='flex flex-col items-center py-4'>
						<DataTime />
					</div>     
					{/* Action */}
					<div className='flex flex-col items-center justify-center pt-4'>
						{roomData && <Booking roomData={roomData} nextMeeting={nextMeeting} currentMeeting={currentMeeting} />}
					</div>
				</div>
				{/* Next meeting */}
				{nextMeeting && (
					<div className='flex justify-center items-center gap-4 py-4'>
						<div>
							<p className='font-bold text-lg'>Next Meeting :</p>
						</div>
						<div>
							<p className='text-lg'>{nextMeeting.summary}</p>
							<p className='text-lg'>{moment(nextMeeting.start).format('hh:mm A')} - {moment(nextMeeting.end).format('hh:mm A')}</p>
						</div>
					</div>
				)}
				{currentMeeting && !nextMeeting && (
					<div className='flex justify-center items-center gap-4 py-4'>
						<div>
							<p className='font-bold text-lg'>Next Meeting :</p>
						</div>
						<div>
							<p className='text-lg'>Available until the rest of the day</p>
						</div>
					</div>
				)}
				{/* Rooms status */}
				{currentMeeting ? (
					<div className='flex justify-center items-center'>
						<div className='rounded-full text-center items-center flex justify-center bg-primary-1 h-8 w-72 text-sm'>
							<p>Currently Not Available</p>
						</div>
					</div>
				) : (<>{nextMeeting ? (
						<div className='flex justify-center items-center'>
							<div className='rounded-full text-center items-center flex justify-center bg-primary-9 h-8 w-72 text-sm'>
								<p>Currently Available</p>
							</div>
						</div>
					) : (
						<div className='flex justify-center'>
							<div className='rounded-full text-center items-center flex justify-center bg-primary-9 h-8 w-72 text-sm'>
								<p>Available until the rest of the day</p>
							</div>
						</div>
					)}
				</>)}
			</div>
		</div>
	)
}
