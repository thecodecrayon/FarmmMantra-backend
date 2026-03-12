const { Inquiry, Product } = require("../../models/index.js");
const { asyncHandler, formatToJSON } = require("../../utils/index.js");

const listInquiries = asyncHandler(async (req, res) => {
  const inquiries = formatToJSON(
    await Inquiry.findAll({
      attributes: ["id", "name", "email", "message"],
      include: [
        {
          model: Product,
          attributes: ["id", "name"],
        },
      ],
    }),
  );

  if (!inquiries)
    throw new Error("Unable to fetch inquiries. Some error occured!");

  res.status(200).json({
    status: false,
    data: inquiries,
    msg: "Inquiries fetched successfully.",
  });
});

const createNewInquiry = asyncHandler(async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message)
    throw new Error("Missing fields! Please provide required fields.");

  const inquiry = formatToJSON(await Inquiry.create({ ...req.body }));

  if (!inquiry)
    throw new Error("Unable to create an inquiry. Some error occured!");

  res.status(201).json({
    status: true,
    data: inquiry,
    msg: "A new Inquiry has been created successfully.",
  });
});

module.exports = {
  listInquiries,
  createNewInquiry,
};
