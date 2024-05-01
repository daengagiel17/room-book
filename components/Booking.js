import { useState, useEffect } from 'react';
import moment from 'moment';
import Facility from '@/components/Facility';
import axios from 'axios';

export default function Booking({ roomData, currentMeeting, nextMeeting }) {
	const [loading, setLoading] = useState(false)
	const [buttonDurations, setButtonDurations] = useState(null)
	const [bookDuration, setBookDuration] = useState(0);
	const [remaining30, setRemaining30] = useState(30);
	const [bookUntil30, setBookUntil30] = useState(null);
	const [remainingSeconds, setRemainingSeconds] = useState(59);
	const [remaining60, setRemaining60] = useState(60);
	const [bookUntil60, setBookUntil60] = useState(null);
	const [nextMeetingHuman, setNextMeetingHuman] = useState("-");
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const setFormattedTime = () => {
			const currentTime = moment()
			// const currentTime = moment("04-26-2024 17:09")
			const minutes = currentTime.minutes();
			let time60 = minutes >= 30 ? moment(currentTime).add(1, 'hour').minutes(30) : moment(currentTime).add(1, 'hour').minutes(0)
			let time30 = minutes >= 30 ? moment(currentTime).add(1, 'hour').minutes(0) : moment(currentTime).minutes(30)
			let remaining = time60.diff(currentTime, 'minutes')
			let diffSeconds = time60.diff(currentTime, 'seconds')
	
			// const nextMeetingTime = null
			const nextMeetingTime = nextMeeting ? moment(nextMeeting.start) : null;
			if(nextMeetingTime){
				const remainingNextMeeting = nextMeetingTime.diff(currentTime, 'minutes');
				if(remainingNextMeeting < remaining){
					time60 = moment(nextMeetingTime)
					time30 = moment(nextMeetingTime).minutes(nextMeetingTime.minutes() - 30)
					remaining = remainingNextMeeting
					diffSeconds = nextMeetingTime.diff(currentMeeting, 'seconds')			
				}
	
				const diffHours = nextMeetingTime.diff(currentTime, 'hours');
				const diffMinutes = nextMeetingTime.diff(currentTime, 'minutes') % 60;
				if(diffHours > 0){
					setNextMeetingHuman(`${diffHours} hours ${diffMinutes} minutes`)
				}else{
					setNextMeetingHuman(`${diffMinutes} minutes`)
				}
			}else{
				setNextMeetingHuman('-')
			}
	
			setRemaining60(remaining)
			setRemaining30(remaining - 30)
			setRemainingSeconds(diffSeconds)
			setBookUntil60(time60)
			setBookUntil30(time30)
	
			if(remaining > 40){
				setButtonDurations([30,60])
			}else if(remaining > 10) {
				setButtonDurations([60])
			}else{
				setButtonDurations([])
			}
		};
	
		const intervalId = setInterval(() => {
			setFormattedTime()
		}, 1000);

		return () => clearInterval(intervalId); // Cleanup interval on component unmount
	}, [currentMeeting, nextMeeting]);

	const confirmBooking = async () => {
		try {
			setLoading(true); // Set loading to true to indicate that booking confirmation is in progress
			const startTime = moment().format('YYYY-MM-DDTHH:mm:ss');
			let endTime = null;
			if(bookDuration === 60){
				endTime = bookUntil60.format('YYYY-MM-DDTHH:mm:ss');
			}
			if(bookDuration === 30){
				endTime = bookUntil30.format('YYYY-MM-DDTHH:mm:ss');
			}

			await axios.post(`/api/rooms/${roomData.slug}/${startTime}/${endTime}`, {
				startTime: startTime,
				endTime: endTime
			});
		} catch (error) {
			console.error('Error confirming booking:', error); // Log any errors that occur during booking
		} finally {
			setShowModal(false)
			setLoading(false); // Set loading to false regardless of whether booking succeeds or fails
		}
	};

	const removeBooking = async (id) => {
	    try {
			setLoading(true)
			await axios.delete(`/api/rooms/${roomData.slug}`, { headers: {"Content-Type": "application/json"}, data: {id} });
	    } catch (error) {
	      console.error('Error booking room:', error);
	    } finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='flex justify-center border rounded-lg border-primary-3 gap-4 w-2/3 items-center h-32 px-4'>
				{currentMeeting ? (
					// Current meeting
					<div
						onClick={() => {
							confirm('Are you sure to remove this meeting?') ? removeBooking(currentMeeting.id) : null
						}}
						className='flex flex-col justify-center items-center'
					>
						<p className='text-2xl font-bold'>{currentMeeting.summary}</p>
						<p className='text-lg'> {moment(currentMeeting.start).format('hh:mm A')} - {moment(currentMeeting.end).format('hh:mm A')}</p>
					</div>
				) : (
					// Book Meeting
					<>
						{buttonDurations?.length == 0 ? (
							<p>Preparation next meeting in {remaining60 > 0 ? `${remaining60} minutes` : `${remainingSeconds} seconds`}</p>
						) : (
							<>
								<div
									onClick={() => {
										if (!loading) {
											setBookDuration(buttonDurations?.length == 2 ? 30 : 60);
											setShowModal(true);
										}
									}}
									className='flex flex-1 justify-between pl-4'
								>
									<div className='flex flex-col gap-2 items-start'>
										<p className='font-bold'>Book Now</p>
										<p className='text-sm'>Next Meeting starts in:</p>
										<div className='border bg-primary-3 min-w-28 text-primary-4 px-4 font-semibold rounded-full'>
											{nextMeetingHuman}
										</div>
									</div>
									{buttonDurations?.length == 2 &&  (
										<div
											className='flex flex-col gap-2 items-center w-32'
										>
											<p className='font-bold'>{remaining30} Minutes</p>
											<p className='text-sm'>Book until</p>                      
											<div className='border bg-primary-3 text-primary-4 w-20 text-center font-semibold rounded-full'>
												{bookUntil30.format('HH:mm')}
											</div>
										</div>												
									)}
								</div>
								{buttonDurations?.length == 2 && <div className='border-l-2 h-20' />}
								{buttonDurations?.length > 0 &&  (
									<div
										onClick={() => {
											if (!loading) {
												setBookDuration(60);
												setShowModal(true);
											}
										}}
											className='flex flex-col gap-2 items-center w-32'
									>
										<p className='font-bold'>{remaining60} Minutes</p>
										<p className='text-sm'>Book until</p>                      
										<div className='border bg-primary-3 text-primary-4 w-20 text-center font-semibold rounded-full'>
											{bookUntil60.format('HH:mm')}
										</div>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
			{/* Facility */}
			<div className='flex items-center w-2/3 text-sm justify-around py-2'>
				{roomData?.specs?.seats && <Facility label={`${roomData.specs.seats} Seats`} image={"/seats.png"} />}
				{roomData?.specs?.hdmi && <Facility label={"HDMI"} image={"/hdmi.png"} />}
				{roomData?.specs?.whiteboard && <Facility label={"Whiteboard"} image={"/whiteboard.png"} />}
				{roomData?.specs?.projector && <Facility label={"Projector"} image={"/projector.png"} />}
			</div>
			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
					<div className='w-80 bg-primary-4 border border-white px-6 py-4 rounded-lg'>
						<p>Are you sure to book this room {bookDuration} minutes?</p>
						<div className='flex justify-center mt-4'>
							<button onClick={confirmBooking} className='bg-gray-600 hover:bg-primary-9 text-white px-4 py-1 mr-4 rounded'>
								Yes
							</button>
							<button onClick={() => setShowModal(false)} className='bg-gray-600 hover:bg-primary-1 px-4 py-1 rounded'>
								No
							</button>
						</div>
					</div>
				</div>
			)}
			{loading && (
				<div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
				</div>
			)}			
		</>
	);
}
