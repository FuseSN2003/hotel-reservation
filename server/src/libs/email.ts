import { Resend } from 'resend';

const resendKey = process.env.RESEND_KEY;
const resend = new Resend(resendKey);

export type EmailInformation = {
  name: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  cost: string;
  paymentMethod: string;
  email: string;
};

export async function sendEmail({
  name,
  checkIn,
  checkOut,
  nights,
  roomType,
  cost,
  paymentMethod,
  email,
}: EmailInformation) {
  const { data, error } = await resend.emails.send({
    from: '[Mof Hotel] <no-reply@mokmaard.space>',
    to: [email],
    subject: '[Mof Hotel] Your receipt has been Issued.',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <header style="background-color: #0971d3; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Hotel Reservation Confirmation</h1>
        </header>

        <main style="padding: 20px;">
            <p style="font-size: 16px;">Dear Valued Guest,</p>
            
            <p style="font-size: 16px;">Thank you for choosing our hotel. We're pleased to confirm your reservation details:</p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Guest name:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Check-in Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${checkIn}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Check-out Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${checkOut}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Number of Nights:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nights}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Room Type:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${roomType}</td>
                </tr>
            </table>

            <h2 style="color: #0971d3;">Payment Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Amount:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${cost}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Payment Method:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${paymentMethod}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Payment Status:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Paid in Full</td>
                </tr>
            </table>

            <h2 style="color: #0971d3;">Important Information</h2>
            <ul style="padding-left: 20px;">
                <li style="margin-bottom: 10px;">Check-in time starts at 3:00 PM. Early check-in is subject to availability.</li>
                <li style="margin-bottom: 10px;">Check-out time is 11:00 AM. Late check-out may result in additional charges.</li>
                <li style="margin-bottom: 10px;">Please present a valid ID and the credit card used for booking upon check-in.</li>
                <li style="margin-bottom: 10px;">Free Wi-Fi is available throughout the hotel.</li>
                <li style="margin-bottom: 10px;">Breakfast is served from 6:30 AM to 10:00 AM in the main restaurant.</li>
                <li style="margin-bottom: 10px;">For any changes or cancellations, please contact us at least 48 hours before your check-in date.</li>
            </ul>

            <p style="font-size: 16px;">If you have any questions or special requests, please don't hesitate to call us at +66 12-345-6789.</p>

            <p style="font-size: 16px;">We look forward to welcoming you to our hotel!</p>

            <p style="font-size: 16px;">Best regards,<br>The Hotel Team</p>
        </main>

        <footer style="background-color: #0971d3; color: #ffffff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">© 2023 Mof hotel. All rights reserved.</p>
        </footer>
    </body>
    </html>`,
  });
}
