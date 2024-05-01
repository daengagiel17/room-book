import { google } from 'googleapis';
const moment = require('moment-timezone')
const shared = require('./shared')
const timezone = shared.timezone
const unifySchedule = shared.unifySchedule
const rooms = JSON.parse(process.env.ROOMS);

const emailClient = process.env.CLIENT_EMAIL
const privateKey = process.env.PRIVATE_KEY

const SCOPES = 'https://www.googleapis.com/auth/calendar';

const auth = new google.auth.JWT(
  emailClient,
  null,
  privateKey,
  SCOPES
);

const calendar = google.calendar({
  version: 'v3',
  auth
})

const getRoom = (slug) => slug in rooms ? rooms[slug] : null

const validEvent = (event) => event.status === 'confirmed' && event.start

const getSummary = (event) => (
  event.visibility === 'private'
    ? 'Private event'
    : event.summary
      ? event.summary
      : 'Untitled event'
)

const normalizeEvent = (event) => {
  const attendees = event.attendees ? event.attendees.filter(a => !a.resource) : []
  const isFlashEvent = event.organizer && event.organizer.email && event.organizer.email.endsWith('@resource.calendar.google.com');
  return {
    id: event.id,
    recurringEventId: event.recurringEventId ? event.recurringEventId : null,
    attendees,
    start: event.start.dateTime,
    end: event.end.dateTime,
    summary: getSummary(event),
    organizer: event.organizer,
    isFlashEvent: isFlashEvent,
    private: event.visibility === 'private',
    available: false
  }
}

const getEvents = (slug) => {
  return new Promise((resolve, reject) => {
    // Query one week before and after
    const timeMin = (new moment.tz(timezone)).add('day').startOf('day');
    const timeMax = (new moment.tz(timezone)).endOf('day');
    const room = getRoom(slug)

    if (!room) {
      return reject('Room doesn\'t exist')
    }

    calendar.events.list({
      calendarId: room.id,
      timeMin: timeMin.format(),
      timeMax: timeMax.format(),
      singleEvents: true,
    }, (err, response) => {
      if (err) return reject(err)
      let events = response.data.items.filter(validEvent)
      events = events.sort((a, b) => moment.utc(a.start.dateTime).diff(moment.utc(b.start.dateTime)))
      events = events.map(normalizeEvent)
      events = unifySchedule(events)
      resolve(events)
    })
  })
}

const bookEvent = async (slug, event) => {
  return new Promise((resolve, reject) => {
    const room = getRoom(slug)
    const now = moment()

    if (!room) {
      reject('Room does not exist')
      return
    }

    calendar.events.insert({
      calendarId: room.id,
      resource: {
        summary: event.summary,
        start: { dateTime: moment(event.start).format() },
        end: { dateTime: moment(event.end).format() }
      }
    }, (err, event) => {
      if (err) {
        console.log(err)
        return reject('Couldn\'t create the event', null)
      }
      resolve(normalizeEvent(event.data))
    })
  });
};

const removeEvent = (slug, eventId) => {
  return new Promise((resolve, reject) => {
    const room = getRoom(slug)

    if (!room) {
      reject('Room does not exist')
      return
    }

    calendar.events.delete({
      calendarId: room.id,
      eventId: eventId
    }, (err, event) => {
      if (err) {
        console.log(err)
        return reject('Couldn\'t delete the event', null)
      }
      resolve(true)
    })
  });
};

module.exports = {
  getRoom,
  getEvents,
  bookEvent,
  removeEvent
}