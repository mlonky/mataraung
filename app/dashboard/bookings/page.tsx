import { getBookings, getBookingStats } from "@/lib/actions/bookings"
import { BookingsClient } from "./bookings-client"

export default async function BookingsPage() {
  const [bookings, stats] = await Promise.all([getBookings(), getBookingStats()])

  return <BookingsClient initialBookings={bookings} stats={stats} />
}
