# Quick Setup Guide | คู่มือการติดตั้งด่วน

## Prerequisites | ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation | การติดตั้ง

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment**
```bash
cp env.example .env.local
# Edit .env.local with your database URL
```

3. **Database setup**
```bash
# Create database
createdb seoule_crm

# Run migrations (when ready)
npm run db:migrate
```

4. **Start development**
```bash
npm run dev
```

## Project Structure | โครงสร้างโปรเจ็กต์

```
seoule/
├── apps/web/              # Next.js web app
├── packages/database/     # Database schema
├── docs/                  # Documentation
└── scripts/              # Build scripts
```

## Available Pages | หน้าที่ยืนยัน

- `/` - Home page
- `/dashboard` - Main dashboard
- `/members` - Member management
- `/staff` - Staff management  
- `/services` - Service catalog
- `/appointments` - Appointment booking

## Next Steps | ขั้นตอนถัดไป

1. Add database migrations
2. Implement authentication
3. Add appointment booking
4. Add payment processing
5. Add reporting features



