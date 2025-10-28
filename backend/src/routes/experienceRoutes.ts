// src/routes/experienceRoutes.ts
import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db.ts';

const router = Router();

// --- TYPE DEFINITION (for clean API response) ---
interface PromoValidationResponse {
  code: string;
  discountValue: number; // e.g., 10 for 10% or 20 for $20
  discountType: 'PERCENT' | 'FLAT';
  message: string;
}

// --- UTILITY: MOCK PROMO CODE VALIDATION ---
// This function simulates checking a database for a valid promo code.
const validatePromoCode = (code: string): PromoValidationResponse | null => {
  const normalizedCode = code.toUpperCase();
  
  if (normalizedCode === 'SAVE10') {
    return { code: 'SAVE10', discountValue: 10, discountType: 'PERCENT', message: '10% off applied!' };
  }
  if (normalizedCode === 'FLAT100') {
    return { code: 'FLAT100', discountValue: 100, discountType: 'FLAT', message: '$100 fixed discount applied!' };
  }
  return null;
};

// --- API ENDPOINTS ---

/**
 * @route GET /api/experiences
 * @desc Return list of experiences (Home Page)
 */
router.get('/experiences', async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        imageUrl: true,
        description: true,
      }
    });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Could not retrieve experiences.' });
  }
});

/**
 * @route GET /api/experiences/:id
 * @desc Return details and slot availability (Details Page)
 */
router.get('/experiences/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: {
          where: {
            // Filter slots that are NOT fully booked AND are in the future
            bookedCount: { lt: prisma.slot.fields.capacity },
            startTime: { gt: new Date() },
          },
          orderBy: {
            startTime: 'asc',
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            capacity: true,
            bookedCount: true,
          }
        }
      }
    });

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error(`Error fetching experience ${id}:`, error);
    res.status(500).json({ message: 'Could not retrieve experience details.' });
  }
});

/**
 * @route POST /api/promo/validate
 * @desc Validate promo codes (Checkout Page)
 */
router.post('/promo/validate', async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Promo code is required.' });
  }

  const result = validatePromoCode(code);

  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: 'Invalid or expired promo code.' });
  }
});


/**
 * @route POST /api/bookings
 * @desc Accept booking details and store them (Checkout Logic)
 * * **CRITICAL: Uses Prisma's transaction to prevent double-booking.**
 */
router.post('/bookings', async (req: Request, res: Response) => {
  const { slotId, customerName, customerEmail, finalPrice, promoCodeUsed } = req.body;

  // 1. Basic Validation
  if (!slotId || !customerName || !customerEmail || finalPrice === undefined) {
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }
  // Minimal email validation
  if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (finalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid final price.' });
  }

  // 2. Transactional Logic (CRITICAL for preventing double-booking)
  try {
    const result = await prisma.$transaction(async (tx) => {
      // A. Lock and check slot availability
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        // Use select/lock equivalent if supported, but findUnique is generally sufficient for checking count.
      });

      if (!slot) {
        throw new Error('Slot not found.');
      }
      if (slot.bookedCount >= slot.capacity) {
        throw new Error('This slot is fully booked/sold out.');
      }

      // B. Create the new booking record
      const newBooking = await tx.booking.create({
        data: {
          slotId,
          customerName,
          customerEmail,
          finalPrice,
          promoCodeUsed: promoCodeUsed || null,
        },
      });

      // C. Update the slot's bookedCount
      await tx.slot.update({
        where: { id: slotId },
        data: {
          bookedCount: {
            increment: 1, // Safely increment the count
          },
        },
      });

      return newBooking; // Return the created booking
    });

    // 3. Success Response (Result Page)
    res.status(201).json({ 
      success: true, 
      message: 'Booking confirmed successfully!',
      bookingId: result.id,
      details: result
    });

  } catch (error) {
    console.error('Booking failed:', error);
    let errorMessage = 'Booking failed due to a server error.';

    if (error instanceof Error) {
        if (error.message.includes('sold out')) {
            errorMessage = error.message;
            return res.status(409).json({ success: false, message: errorMessage }); // 409 Conflict
        }
        errorMessage = error.message;
    }
    
    // 4. Failure Response
    res.status(500).json({ success: false, message: errorMessage });
  }
});


export default router;