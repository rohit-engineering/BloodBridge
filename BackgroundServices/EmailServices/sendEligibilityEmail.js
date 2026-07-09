const ejs = require("ejs");
const path = require("path");
const { query } = require("../utils/db");
const sendMail = require("../helpers/sendmail");

const sendEligibilityEmail = async () => {
  const { rows: prospects } = await query(
    "SELECT * FROM prospects WHERE status = 0 AND (age < 18 OR weight < 50)"
  );
  for (const prospect of prospects) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/BloodDonationEligibility.ejs"),
        { name: prospect.name, age: prospect.age, weight: prospect.weight }
      );
      await sendMail({
        from: process.env.EMAIL,
        to: prospect.email,
        subject: "Blood donation eligibility update",
        html,
      });
      await query("DELETE FROM prospects WHERE id = $1", [prospect.id]);
    } catch (error) {
      console.error(`Eligibility email failed for ${prospect.email}:`, error.message);
    }
  }
};

module.exports = { sendEligibilityEmail };
