# Supabase Setup Guide | คู่มือการตั้งค่า Supabase

## 1. Create Supabase Project | สร้างโปรเจ็กต์ Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region (Asia Southeast for Thailand)
4. Set database password

## 2. Get Connection Details | รับรายละเอียดการเชื่อมต่อ

From your Supabase dashboard:
- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **Database URL**: `postgresql://postgres:[PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
- **Anon Key**: From Settings > API
- **Service Role Key**: From Settings > API

## 3. Update Environment Variables | อัปเดตตัวแปรสภาพแวดล้อม

```bash
# Copy example file
cp env.example .env.local

# Edit .env.local with your Supabase details
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

## 4. Run Database Migration | รันการย้ายฐานข้อมูล

```bash
# This will create tables in your Supabase database
npm run db:migrate

# Add sample data
npm run db:seed
```

## 5. Enable Row Level Security (Optional) | เปิดใช้ Row Level Security (ไม่บังคับ)

In Supabase SQL Editor, run:

```sql
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies (example for members table)
CREATE POLICY "Allow all operations for authenticated users" ON members
FOR ALL USING (auth.role() = 'authenticated');
```

## 6. Start Development | เริ่มการพัฒนา

```bash
npm run dev
```

Your app will now be connected to Supabase! 🎉

## Benefits of Supabase | ประโยชน์ของ Supabase

- ✅ **Real-time subscriptions** | การสมัครสมาชิกแบบเรียลไทม์
- ✅ **Built-in authentication** | การยืนยันตัวตนในตัว
- ✅ **Automatic API generation** | การสร้าง API อัตโนมัติ
- ✅ **Database dashboard** | แดชบอร์ดฐานข้อมูล
- ✅ **Edge functions** | ฟังก์ชัน Edge
- ✅ **Storage** | ที่เก็บข้อมูล



