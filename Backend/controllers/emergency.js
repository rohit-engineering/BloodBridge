const { query } = require("../utils/db");

const columns = `
  id::text AS "_id", patient_name AS "patientName", hospital, bloodgroup,
  units_required AS "unitsRequired", required_date AS "date",
  contact_number AS "contactNumber", urgency, status,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;

const createEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName, hospital, bloodgroup, unitsRequired,
      date, contactNumber, urgency,
    } = req.body;
    if (!patientName || !hospital || !bloodgroup || !unitsRequired || !date || !contactNumber || !urgency) {
      return res.status(400).json({ message: "Every emergency request field is required" });
    }
    if (!["Critical", "Urgent", "Standard"].includes(urgency)) {
      return res.status(400).json({ message: "Select a valid urgency" });
    }
    const result = await query(
      `INSERT INTO emergency_requests
       (patient_name, hospital, bloodgroup, units_required, required_date, contact_number, urgency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${columns}`,
      [patientName.trim(), hospital.trim(), bloodgroup, unitsRequired, date, contactNumber.trim(), urgency]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create emergency request failed:", error);
    return res.status(error.code === "22P02" || error.code === "23514" ? 400 : 500)
      .json({ message: "Could not create emergency request" });
  }
};

const getEmergencyRequests = async (req, res) => {
  try {
    const activeOnly = req.query.all !== "true";
    const paginated = req.query.paginated === "true";
    const values = [];
    const conditions = [];
    if (activeOnly) conditions.push("status = 'Active'");
    if (req.query.bloodgroup && req.query.bloodgroup !== "All") {
      values.push(req.query.bloodgroup);
      conditions.push(`bloodgroup = $${values.length}`);
    }
    if (req.query.urgency && req.query.urgency !== "All") {
      values.push(req.query.urgency);
      conditions.push(`urgency = $${values.length}`);
    }
    if (req.query.search) {
      values.push(`%${req.query.search.trim()}%`);
      conditions.push(`(patient_name ILIKE $${values.length} OR hospital ILIKE $${values.length} OR contact_number ILIKE $${values.length})`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 8));
    const countResult = paginated
      ? await query(`SELECT COUNT(*)::integer AS total FROM emergency_requests ${where}`, values)
      : null;
    const pagingValues = [...values];
    let pagingSql = "";
    if (paginated) {
      pagingValues.push(pageSize, (page - 1) * pageSize);
      pagingSql = `LIMIT $${pagingValues.length - 1} OFFSET $${pagingValues.length}`;
    }
    const result = await query(
      `SELECT ${columns} FROM emergency_requests ${where}
       ORDER BY
         CASE urgency WHEN 'Critical' THEN 1 WHEN 'Urgent' THEN 2 ELSE 3 END,
         required_date ASC, created_at DESC ${pagingSql}`,
      pagingValues
    );
    if (!paginated) return res.json(result.rows);
    const total = countResult.rows[0].total;
    return res.json({
      items: result.rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    console.error("Fetch emergency requests failed:", error);
    return res.status(500).json({ message: "Could not fetch emergency requests" });
  }
};

const updateEmergencyStatus = async (req, res) => {
  try {
    if (!["Active", "Fulfilled", "Closed"].includes(req.body.status)) {
      return res.status(400).json({ message: "Select a valid status" });
    }
    const result = await query(
      `UPDATE emergency_requests SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING ${columns}`,
      [req.body.status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Emergency request not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not update emergency request" });
  }
};

const deleteEmergencyRequest = async (req, res) => {
  try {
    const result = await query("DELETE FROM emergency_requests WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Emergency request not found" });
    return res.json({ message: "Emergency request deleted" });
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not delete emergency request" });
  }
};

module.exports = {
  createEmergencyRequest,
  deleteEmergencyRequest,
  getEmergencyRequests,
  updateEmergencyStatus,
};
