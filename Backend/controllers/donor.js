const { query } = require("../utils/db");

const donorColumns = `
  id::text AS "_id", name, email, address, tel, bloodgroup, weight,
  donation_date AS "date", diseases, age, bloodpressure, status,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;
const fields = {
  name: "name", email: "email", address: "address", tel: "tel",
  bloodgroup: "bloodgroup", weight: "weight", date: "donation_date",
  diseases: "diseases", age: "age", bloodpressure: "bloodpressure", status: "status",
};

const createDonor = async (req, res) => {
  try {
    const { name, email, address, tel, bloodgroup, weight, date, diseases, age, bloodpressure } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    const result = await query(
      `INSERT INTO donors
       (name, email, address, tel, bloodgroup, weight, donation_date, diseases, age, bloodpressure)
       VALUES ($1, LOWER($2), $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${donorColumns}`,
      [name, email, address || null, tel || null, bloodgroup || null, weight || null, date || null, diseases || null, age || null, bloodpressure || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create donor failed:", error);
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not create donor" });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const result = await query(`SELECT ${donorColumns} FROM donors ORDER BY created_at DESC`);
    return res.json(result.rows);
  } catch (error) {
    console.error("Fetch donors failed:", error);
    return res.status(500).json({ message: "Could not fetch donors" });
  }
};

const updateDonor = async (req, res) => {
  try {
    const entries = Object.entries(req.body).filter(([key]) => fields[key]);
    if (!entries.length) return res.status(400).json({ message: "No valid fields to update" });
    const assignments = entries.map(([key], index) => `${fields[key]} = $${index + 1}`);
    const values = entries.map(([, value]) => value === "" ? null : value);
    values.push(req.params.id);
    const result = await query(
      `UPDATE donors SET ${assignments.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length} RETURNING ${donorColumns}`,
      values
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Donor not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Update donor failed:", error);
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not update donor" });
  }
};

const getOneDonor = async (req, res) => {
  try {
    const result = await query(`SELECT ${donorColumns} FROM donors WHERE id = $1`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Donor not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not fetch donor" });
  }
};

const deleteDonor = async (req, res) => {
  try {
    const result = await query("DELETE FROM donors WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Donor not found" });
    return res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not delete donor" });
  }
};

const getDonorStats = async (req, res) => {
  try {
    const result = await query(
      `SELECT bloodgroup AS "_id", COUNT(*)::integer AS count
       FROM donors GROUP BY bloodgroup ORDER BY bloodgroup`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch donor statistics" });
  }
};

module.exports = { deleteDonor, getOneDonor, getAllDonors, getDonorStats, updateDonor, createDonor };
