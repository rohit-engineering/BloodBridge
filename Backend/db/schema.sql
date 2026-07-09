CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT,
  tel VARCHAR(40),
  bloodgroup VARCHAR(4),
  weight NUMERIC(6,2),
  donation_date DATE,
  diseases TEXT,
  age INTEGER,
  bloodpressure NUMERIC(6,2),
  status INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT,
  tel VARCHAR(40),
  bloodgroup VARCHAR(4),
  weight NUMERIC(6,2),
  donation_date DATE,
  diseases TEXT,
  age INTEGER,
  bloodpressure NUMERIC(6,2),
  status INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(120) NOT NULL,
  hospital VARCHAR(180) NOT NULL,
  bloodgroup VARCHAR(4) NOT NULL,
  units_required INTEGER NOT NULL CHECK (units_required > 0),
  required_date DATE NOT NULL,
  contact_number VARCHAR(40) NOT NULL,
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Critical', 'Urgent', 'Standard')),
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Fulfilled', 'Closed')),
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donors_bloodgroup ON donors (bloodgroup);
CREATE INDEX IF NOT EXISTS idx_donors_created_at ON donors (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects (status);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_active ON emergency_requests (status, urgency, required_date);
