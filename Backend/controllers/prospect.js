const { getPool, query } = require("../utils/db");

const prospectColumns = `
  id::text AS "_id", name, email, address, tel, bloodgroup, weight,
  donation_date AS "date", diseases, age, bloodpressure, status,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;
const fields = {
  name: "name", email: "email", address: "address", tel: "tel",
  bloodgroup: "bloodgroup", weight: "weight", date: "donation_date",
  diseases: "diseases", age: "age", bloodpressure: "bloodpressure", status: "status",
};

const createProspect = async (req, res) => {
  try {
    const { name, email, address, tel, bloodgroup, weight, date, diseases, age, bloodpressure } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    const result = await query(
      `INSERT INTO prospects
       (name, email, address, tel, bloodgroup, weight, donation_date, diseases, age, bloodpressure)
       VALUES ($1, LOWER($2), $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${prospectColumns}`,
      [name, email, address || null, tel || null, bloodgroup || null, weight || null, date || null, diseases || null, age || null, bloodpressure || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create prospect failed:", error);
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not create prospect" });
  }
};

const getAllProspects = async (req, res) => {
  try {
    const result = await query(`SELECT ${prospectColumns} FROM prospects ORDER BY created_at DESC`);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch prospects" });
  }
};

const updateProspect = async (req, res) => {
  try {
    const entries = Object.entries(req.body).filter(([key]) => fields[key]);
    if (!entries.length) return res.status(400).json({ message: "No valid fields to update" });
    const assignments = entries.map(([key], index) => `${fields[key]} = $${index + 1}`);
    const values = entries.map(([, value]) => value === "" ? null : value);
    values.push(req.params.id);
    const result = await query(
      `UPDATE prospects SET ${assignments.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length} RETURNING ${prospectColumns}`,
      values
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Prospect not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not update prospect" });
  }
};

const getOneProspect = async (req, res) => {
  try {
    const result = await query(`SELECT ${prospectColumns} FROM prospects WHERE id = $1`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Prospect not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not fetch prospect" });
  }
};

const deleteProspect = async (req, res) => {
  try {
    const result = await query("DELETE FROM prospects WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Prospect not found" });
    return res.json({ message: "Prospect deleted successfully" });
  } catch (error) {
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not delete prospect" });
  }
};

const approveProspect = async (req, res) => {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const prospectResult = await client.query(
      "SELECT * FROM prospects WHERE id = $1 FOR UPDATE",
      [req.params.id]
    );
    const prospect = prospectResult.rows[0];
    if (!prospect) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Prospect not found or already approved" });
    }
    const donorResult = await client.query(
      `INSERT INTO donors
       (name, email, address, tel, bloodgroup, weight, donation_date, diseases, age, bloodpressure)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${prospectColumns}`,
      [
        prospect.name, prospect.email, prospect.address, prospect.tel,
        prospect.bloodgroup, prospect.weight, prospect.donation_date,
        prospect.diseases, prospect.age, prospect.bloodpressure,
      ]
    );
    await client.query("DELETE FROM prospects WHERE id = $1", [req.params.id]);
    await client.query("COMMIT");
    return res.status(201).json({
      message: "Prospect approved and added to donors",
      donor: donorResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Approve prospect failed:", error);
    return res.status(error.code === "22P02" ? 400 : 500).json({ message: "Could not approve prospect" });
  } finally {
    client.release();
  }
};

module.exports = {
  approveProspect,
  deleteProspect,
  getOneProspect,
  getAllProspects,
  updateProspect,
  createProspect,
};
