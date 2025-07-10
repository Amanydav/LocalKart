
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to LocalKart!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to LocalKart, ${data.name}!</h2>
        <p>Thank you for joining our hyperlocal marketplace. You can now book local services with ease.</p>
        <p>Start exploring our services and book your first appointment today!</p>
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  resetPassword: (data) => ({
    subject: 'Password Reset Request - LocalKart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested a password reset for your LocalKart account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in ${data.expiresIn}.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  bookingConfirmation: (data) => ({
    subject: 'Booking Confirmation - LocalKart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Booking Confirmed!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date:</strong> ${data.bookingDate}</p>
          <p><strong>Time:</strong> ${data.timeSlot}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Total Price:</strong> ₹${data.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        </div>
        <p>A provider will be assigned to your booking soon. You'll receive another email with provider details.</p>
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  bookingStatusUpdate: (data) => ({
    subject: `Booking ${data.status.charAt(0).toUpperCase() + data.status.slice(1)} - LocalKart`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Booking Status Update</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your booking for <strong>${data.serviceName}</strong> has been <strong>${data.status}</strong>.</p>
        <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        ${data.providerNotes ? `<p><strong>Provider Notes:</strong> ${data.providerNotes}</p>` : ''}
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  providerAssigned: (data) => ({
    subject: 'Provider Assigned - LocalKart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Provider Assigned to Your Booking</h2>
        <p>Hi ${data.customerName},</p>
        <p>Great news! A provider has been assigned to your booking for <strong>${data.serviceName}</strong>.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Email:</strong> ${data.providerEmail}</p>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        </div>
        <p>The provider will contact you soon to confirm the appointment details.</p>
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  bookingAssignment: (data) => ({
    subject: 'New Booking Assignment - LocalKart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Booking Assignment</h2>
        <p>Hi ${data.providerName},</p>
        <p>You have been assigned a new booking:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date:</strong> ${data.bookingDate}</p>
          <p><strong>Time:</strong> ${data.timeSlot}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        </div>
        <p>Please contact the customer to confirm the appointment details.</p>
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  }),

  newProviderRequest: (data) => ({
    subject: 'New Provider Request - LocalKart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Provider Request</h2>
        <p>A new provider request has been submitted:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
          <p><strong>Business Name:</strong> ${data.businessName}</p>
          <p><strong>Business Type:</strong> ${data.businessType}</p>
          <p><strong>Services:</strong> ${data.services}</p>
          <p><strong>Request ID:</strong> ${data.requestId}</p>
        </div>
        <p>Please review and approve/reject this request in the admin panel.</p>
        <p>LocalKart System</p>
      </div>
    `
  }),

  providerRequestStatus: (data) => ({
    subject: `Provider Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)} - LocalKart`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Provider Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</h2>
        <p>Hi ${data.userName},</p>
        <p>Your provider request has been <strong>${data.status}</strong>.</p>
        ${data.adminNotes ? `<p><strong>Admin Notes:</strong> ${data.adminNotes}</p>` : ''}
        <p><strong>Request ID:</strong> ${data.requestId}</p>
        ${data.status === 'approved' ? '<p>Congratulations! You can now start accepting bookings as a provider.</p>' : ''}
        <p>Best regards,<br>LocalKart Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html: data.html || data.text };
    }

    const mailOptions = {
      from: `LocalKart <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
