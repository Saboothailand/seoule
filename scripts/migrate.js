const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { members, staffs, services, appointments, users, sessions } = require('../packages/database/schema');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    console.log('Creating tables...');
    
    // Create tables in order
    await client`CREATE TABLE IF NOT EXISTS members (
      member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await client`CREATE TABLE IF NOT EXISTS staffs (
      staff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      position VARCHAR(50) NOT NULL,
      hourly_rate DECIMAL(10,2),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await client`CREATE TABLE IF NOT EXISTS services (
      service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      duration INTEGER NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    // Create enum type for appointment status
    await client`CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')`;

    await client`CREATE TABLE IF NOT EXISTS appointments (
      appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      member_id UUID NOT NULL,
      staff_id UUID NOT NULL,
      service_id UUID NOT NULL,
      appointment_date TIMESTAMP NOT NULL,
      duration INTEGER NOT NULL,
      status appointment_status NOT NULL DEFAULT 'scheduled',
      total_price DECIMAL(10,2),
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    // Create enum type for user roles
    await client`CREATE TYPE user_role AS ENUM ('admin', 'staff', 'member')`;

    await client`CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role user_role NOT NULL DEFAULT 'member',
      is_active BOOLEAN NOT NULL DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await client`CREATE TABLE IF NOT EXISTS sessions (
      session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      token VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrate();



