import * as lib from '../../../lib/index'; // Import your library functions

export default async function handler(req, res) {
  try {
    const { slug } = req.query;
    // Check the length of the slug array to determine the route pattern
    if (slug.length === 1) {
      if (req.method === 'GET') {
        const result = await lib.getRoom(req, res);
        res.status(200).json({ result });
      } else if (req.method === 'POST') {
        const result = await lib.quickBook(req, res);
        res.status(200).json({ result });
      } else if (req.method === 'DELETE') {
        const result = await lib.removeBooking(req, res);
        res.status(200).json({ result });
      } else {
        res.status(405).json({ error: 'Method Not Allowed' });
      }
    } else if (slug.length === 3) {
      const [room, start, end] = slug;
      if (req.method === 'POST') {
        const result = await lib.quickBook(req, res);
        res.status(200).json({ result });
      } else {
        res.status(405).json({ error: 'Method Not Allowed' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
}
