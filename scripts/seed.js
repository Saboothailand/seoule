const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(connectionString);

  try {
    console.log('Seeding database...');

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await client`
      INSERT INTO users (email, password_hash, full_name, phone, role, is_active) VALUES
      ('admin@seoule.com', ${adminPassword}, 'Admin User', '+66-90-000-0000', 'admin', true)
      ON CONFLICT (email) DO NOTHING
    `;

    // Create sample staff users
    const staffPassword = await bcrypt.hash('staff123', 12);
    await client`
      INSERT INTO users (email, password_hash, full_name, phone, role, is_active) VALUES
      ('nina@seoule.com', ${staffPassword}, 'Nina Rodriguez', '+66-91-111-1111', 'staff', true),
      ('priya@seoule.com', ${staffPassword}, 'Priya Kumar', '+66-92-222-2222', 'staff', true),
      ('yuki@seoule.com', ${staffPassword}, 'Yuki Tanaka', '+66-93-333-3333', 'staff', true),
      ('maria@seoule.com', ${staffPassword}, 'Maria Santos', '+66-94-444-4444', 'staff', true)
      ON CONFLICT (email) DO NOTHING
    `;

    // Insert sample members
    await client`
      INSERT INTO members (full_name, phone, email, status) VALUES
      ('Sarah Johnson', '+66-81-234-5678', 'sarah@email.com', 'active'),
      ('Maya Patel', '+66-82-345-6789', 'maya@email.com', 'active'),
      ('Lisa Chen', '+66-83-456-7890', 'lisa@email.com', 'active'),
      ('Anna Smith', '+66-84-567-8901', 'anna@email.com', 'active'),
      ('Emma Wilson', '+66-85-678-9012', 'emma@email.com', 'active')
      ON CONFLICT (phone) DO NOTHING
    `;

    // Insert sample staff
    await client`
      INSERT INTO staffs (full_name, phone, email, position, hourly_rate, status) VALUES
      ('Nina Rodriguez', '+66-91-111-1111', 'nina@seoule.com', 'Senior Nail Artist', 500.00, 'active'),
      ('Priya Kumar', '+66-92-222-2222', 'priya@seoule.com', 'Nail Artist', 400.00, 'active'),
      ('Yuki Tanaka', '+66-93-333-3333', 'yuki@seoule.com', 'Junior Nail Artist', 350.00, 'active'),
      ('Maria Santos', '+66-94-444-4444', 'maria@seoule.com', 'Manager', 600.00, 'active')
      ON CONFLICT (email) DO NOTHING
    `;

    // Insert sample services
    await client`
      INSERT INTO services (name, description, category, price, duration, is_active) VALUES
      ('Classic Manicure', 'Basic nail care and polish', 'Manicure', 300.00, 60, true),
      ('Gel Manicure', 'Long-lasting gel polish application', 'Manicure', 500.00, 90, true),
      ('French Manicure', 'Classic white tip design', 'Manicure', 400.00, 75, true),
      ('Classic Pedicure', 'Foot care and polish', 'Pedicure', 400.00, 90, true),
      ('Gel Pedicure', 'Long-lasting gel polish for feet', 'Pedicure', 600.00, 120, true),
      ('Nail Art Design', 'Custom nail art and designs', 'Nail Art', 800.00, 120, true),
      ('Nail Extension', 'Acrylic or gel extensions', 'Extensions', 1200.00, 180, true),
      ('Nail Repair', 'Fix broken or damaged nails', 'Repair', 200.00, 30, true)
      ON CONFLICT DO NOTHING
    `;

    // Insert sample appointments
    const members = await client`SELECT member_id FROM members LIMIT 3`;
    const staff = await client`SELECT staff_id FROM staffs LIMIT 2`;
    const services = await client`SELECT service_id, price, duration FROM services LIMIT 3`;

    if (members.length > 0 && staff.length > 0 && services.length > 0) {
      const appointmentDate1 = new Date();
      appointmentDate1.setDate(appointmentDate1.getDate() + 1);
      appointmentDate1.setHours(10, 0, 0, 0);

      const appointmentDate2 = new Date();
      appointmentDate2.setDate(appointmentDate2.getDate() + 2);
      appointmentDate2.setHours(14, 30, 0, 0);

      const appointmentDate3 = new Date();
      appointmentDate3.setDate(appointmentDate3.getDate() + 3);
      appointmentDate3.setHours(16, 0, 0, 0);

      await client`
        INSERT INTO appointments (member_id, staff_id, service_id, appointment_date, duration, status, total_price, notes) VALUES
        (${members[0].member_id}, ${staff[0].staff_id}, ${services[0].service_id}, ${appointmentDate1.toISOString()}, ${services[0].duration}, 'scheduled', ${services[0].price}, '첫 방문 고객'),
        (${members[1].member_id}, ${staff[1].staff_id}, ${services[1].service_id}, ${appointmentDate2.toISOString()}, ${services[1].duration}, 'confirmed', ${services[1].price}, '정기 방문'),
        (${members[2].member_id}, ${staff[0].staff_id}, ${services[2].service_id}, ${appointmentDate3.toISOString()}, ${services[2].duration}, 'scheduled', ${services[2].price}, '특별 요청 있음')
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.end();
  }
}

seed();



