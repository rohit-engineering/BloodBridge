const ejs = require("ejs");
const path = require("path");
const { query } = require("../utils/db");
const sendMail = require("../helpers/sendmail");

const sendEmergencyRequestEmails = async () => {
  const { rows: requests } = await query(
    `SELECT * FROM emergency_requests
     WHERE status = 'Active' AND notification_sent = FALSE
     ORDER BY created_at`
  );
  for (const request of requests) {
    const { rows: donors } = await query(
      "SELECT DISTINCT email FROM donors WHERE bloodgroup = $1 AND email IS NOT NULL",
      [request.bloodgroup]
    );
    const recipients = new Set(donors.map((donor) => donor.email));
    recipients.add(process.env.ADMIN_EMAIL);
    recipients.delete(undefined);

    const html = await ejs.renderFile(
      path.join(__dirname, "../templates/EmergencyBloodRequest.ejs"),
      {
        patientName: request.patient_name,
        hospital: request.hospital,
        bloodgroup: request.bloodgroup,
        unitsRequired: request.units_required,
        date: request.required_date,
        contactNumber: request.contact_number,
        urgency: request.urgency,
      }
    );
    const results = await Promise.allSettled(
      [...recipients].map((to) => sendMail({
        from: process.env.EMAIL,
        to,
        subject: `${request.urgency}: ${request.bloodgroup} blood required at ${request.hospital}`,
        html,
      }))
    );
    if (results.some((result) => result.status === "fulfilled")) {
      await query(
        "UPDATE emergency_requests SET notification_sent = TRUE, updated_at = NOW() WHERE id = $1",
        [request.id]
      );
    }
    results.filter((result) => result.status === "rejected")
      .forEach((result) => console.error("Emergency email failed:", result.reason.message));
  }
};

module.exports = { sendEmergencyRequestEmails };
