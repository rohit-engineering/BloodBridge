const ejs = require("ejs");
const path = require("path");
const { query } = require("../utils/db");
const sendMail = require("../helpers/sendmail");

const sendDonorDetailsEmail = async () => {
  const { rows: donors } = await query("SELECT * FROM donors WHERE status = 0");
  for (const donor of donors) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/BloodDonationDonor.ejs"),
        {
          name: donor.name,
          email: donor.email,
          tel: donor.tel,
          address: donor.address,
          bloodgroup: donor.bloodgroup,
          diseases: donor.diseases,
          weight: donor.weight,
          bloodpressure: donor.bloodpressure,
          age: donor.age,
          date: donor.donation_date,
        }
      );
      await sendMail({
        from: process.env.EMAIL,
        to: donor.email,
        subject: "Welcome to BloodBridge",
        html,
      });
      await query("UPDATE donors SET status = 1, updated_at = NOW() WHERE id = $1", [donor.id]);
    } catch (error) {
      console.error(`Donor email failed for ${donor.email}:`, error.message);
    }
  }
};

module.exports = { sendDonorDetailsEmail };
