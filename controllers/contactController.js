const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse.js");
const Contact = require("../models/contactModel.js");
const nodemailer = require("nodemailer");

const getEnquiryPayload = (body) => {
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const phone = body?.phone?.toString().trim() || "";
  const message = (body?.message || body?.msg || "").trim();
  const topic = body?.topic?.trim();

  return {
    name,
    email,
    phone,
    message,
    topic,
  };
};

const validateEnquiryPayload = ({ name, email, message, topic }) => {
  const requiredFields = { name, email, message, topic };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new ApiError(400, `${key} is required`);
    }
  }
};

const sendEnquiryNotification = async ({ name, email, phone, message, topic }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return {
      sent: false,
      reason: "SMTP credentials are not configured",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    secure: true,
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    replyTo: email,
    to: "toletglobetech@gmail.com",
    subject: `Enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nTopic: ${topic}\nMessage: ${message}\n`,
  });

  return {
    sent: true,
  };
};

const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Contact.find({});

  if (!enquiries) {
    throw new ApiError(404, "No enquiries found");
  }

  res.json(
    new ApiResponse(200, enquiries, "Enquiries retrieved successfully!")
  );
});

const createEnquiry = asyncHandler(async (req, res) => {
  const enquiryPayload = getEnquiryPayload(req.body);
  validateEnquiryPayload(enquiryPayload);

  const enquiry = await Contact.create(enquiryPayload);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        enquiry,
        "Your enquiry has been successfully submitted!"
      )
    );
});

const getEnquiryById = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  const enquiry = await Contact.findById(enquiryId);

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, enquiry, "Enquiry retrieved successfully"));
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  const enquiry = await Contact.findByIdAndDelete(enquiryId);

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, null, "Enquiry deleted successfully"));
});

//submit form info send to mail
const submitData = asyncHandler(async (req, res) => {
  const enquiryPayload = getEnquiryPayload(req.body);
  validateEnquiryPayload(enquiryPayload);

  const enquiry = await Contact.create(enquiryPayload);
  const notification = await sendEnquiryNotification(enquiryPayload);

  const message = notification.sent
    ? "Enquiry submitted successfully and notification email sent."
    : "Enquiry submitted successfully. Email notification is not configured yet.";

  res.status(201).json(new ApiResponse(201, enquiry, message));
});

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  deleteEnquiry,
  submitData,
};
