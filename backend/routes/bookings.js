import { Router } from 'express';
import Booking from '../models/Booking.js';
import { sendMail } from '../utils/mailer.js';
import { verifyToken } from '../middleware/auth.js';

import crypto from 'crypto';

const router = Router();

// Basic input validation helper
function isValidBooking(b) {
  const required = ['name','email','phone','service','date','time'];
  return required.every(k => typeof b[k] === 'string' && b[k].trim().length > 0);
}

// Utility: generate all slots between 9:00–17:00 (30 min interval)
function generateTimes() {
  const times = [];
  let start = 9 * 60; // 9:00 in minutes
  let end = 17 * 60;  // 5:00 PM in minutes

  for (let mins = start; mins <= end; mins += 30) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    times.push(`${hh}:${mm}`);
  }
  return times;
}






// --- Create a booking ---
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log('Booking request:', data);

    if (!isValidBooking(data)) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if slot already taken
    const exists = await Booking.findOne({ date: data.date, time: data.time });
    if (exists) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    // Generate booking reference
    const ref = crypto.randomBytes(3).toString('hex').toUpperCase();
    
     const booking = await Booking.create({ ...data });
    
     // Email customer
       try {
      await sendMail({
        to: booking.email,
        subject: `Booking Confirmed - Ref #${ref}`,
        html: `<p>Hi ${booking.name},</p>
               <p>Your appointment has been <b>confirmed</b>:</p>
               <ul>
                 <li><b>Service:</b> ${booking.service}</li>
                 <li><b>Date:</b> ${booking.date}</li>
                 <li><b>Time:</b> ${booking.time}</li>
                 <li><b>Reference:</b> ${ref}</li>
               </ul>
               <p>Please keep this email for your records.</p>
               <p>- ${process.env.BUSINESS_NAME || 'Your Auto Shop'}</p>`
      });
    } catch (e) {
      console.warn('Customer email failed:', e.message);
    }

    // Notify shop owner
    if (process.env.NOTIFY_TO) {
      try {
        await sendMail({
          to: process.env.NOTIFY_TO,
          subject: `New Booking - ${booking.service}`,
          html: `<p>New booking received:</p>
                 <ul>
                   <li>Name: ${booking.name}</li>
                   <li>Email: ${booking.email}</li>
                   <li>Phone: ${booking.phone}</li>
                   <li>Service: ${booking.service}</li>
                   <li>Date/Time: ${booking.date} ${booking.time}</li>
                   <li>Notes: ${booking.notes || '-'}</li>
                   <li>Reference: ${ref}</li>
                 </ul>`
        });
      } catch (e) {
        console.warn('Owner email failed:', e.message);
      }
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
// --- Get all bookings (admin only) ---
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await Booking.find().sort({ createdAt: -1 }).limit(200);
    res.json(items);
    console.log(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// PUT / DELETE combined approach
router.put("/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status update" });
  }

  try {
    let updated;

    if (status === "cancelled") {
      // DELETE the booking
      updated = await Booking.findByIdAndDelete(req.params.id);
      if (!updated)
        return res.status(404).json({ message: "Booking not found" });

      return res.json({ message: "Booking cancelled and deleted", deletedId: req.params.id });
    } else {
      // UPDATE for other statuses
      updated = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Booking not found" });

      return res.json(updated);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});




// --- Get available times for a specific date ---
router.get('/available-times', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const allTimes = generateTimes();

    // Find all bookings on this date
    const booked = await Booking.find({ date }).select('time -_id');
    const bookedTimes = booked.map(b => b.time);

    // Filter available slots
    const available = allTimes.filter(t => !bookedTimes.includes(t));

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
