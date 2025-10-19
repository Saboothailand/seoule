# Database Schema Design | การออกแบบฐานข้อมูล

## Overview | ภาพรวม

This document outlines the database schema for the Nail Art Salon CRM system, designed to support member management, staff management, service management, and promotion systems with multilingual support.

เอกสารนี้อธิบายโครงสร้างฐานข้อมูลสำหรับระบบ CRM ร้านทำเล็บ ซึ่งออกแบบมาเพื่อรองรับการจัดการสมาชิก การจัดการพนักงาน การจัดการบริการ และระบบโปรโมชั่นพร้อมการรองรับหลายภาษา

## Core Entities | เอนทิตี้หลัก

### 1. Users Table | ตารางผู้ใช้

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Store user authentication and basic info / ข้อมูลการยืนยันตัวตนและข้อมูลพื้นฐานของผู้ใช้ร้าน | id, email, password_hash, role, status | UUID, VARCHAR(255), VARCHAR(255), ENUM, ENUM | UNIQUE(email), NOT NULL | PRIMARY(id), UNIQUE(email), INDEX(role) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `email`: Unique email address / ที่อยู่อีเมลที่ไม่ซ้ำกัน
- `password_hash`: Bcrypt hashed password / รหัสผ่านที่เข้ารหัสด้วย Bcrypt
- `role`: ENUM('admin', 'manager', 'staff') / บทบาท ENUM
- `status`: ENUM('active', 'inactive', 'suspended') / สถานะ ENUM
- `permissions`: JSONB for role-based permissions / JSONB สำหรับสิทธิ์ตามบทบาท
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต
- `last_login_at`: Timestamp / วันที่เข้าสู่ระบบล่าสุด

### 2. Members Table | ตารางสมาชิก

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Customer information and loyalty data / ข้อมูลลูกค้าและข้อมูลความภักดี | id, phone, email, name, points_balance | UUID, VARCHAR(20), VARCHAR(255), VARCHAR(100), INTEGER | UNIQUE(phone), NOT NULL(name) | PRIMARY(id), UNIQUE(phone), INDEX(points_balance) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `phone`: Unique phone number / หมายเลขโทรศัพท์ที่ไม่ซ้ำกัน
- `email`: Optional email address / ที่อยู่อีเมล (ไม่บังคับ)
- `name`: Full name / ชื่อเต็ม
- `date_of_birth`: Date / วันเกิด
- `gender`: ENUM('male', 'female', 'other') / เพศ ENUM
- `points_balance`: Current points balance / แต้มคงเหลือปัจจุบัน
- `total_spent`: Total amount spent / ยอดเงินที่ใช้ไปทั้งหมด
- `visit_count`: Number of visits / จำนวนครั้งที่มาใช้บริการ
- `last_visit_at`: Last visit date / วันที่มาใช้บริการล่าสุด
- `marketing_consent`: Boolean for marketing permission / บูลีนสำหรับความยินยอมทางการตลาด
- `notes`: Text notes / หมายเหตุ
- `tags`: JSONB array of tags / อาร์เรย์ JSONB ของแท็ก
- `status`: ENUM('active', 'inactive', 'blacklisted') / สถานะ ENUM
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต
- `deleted_at`: Soft delete timestamp / วันที่ลบแบบ soft delete

### 3. Staff Table | ตารางพนักงาน

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Staff member information and performance tracking / ข้อมูลพนักงานและการติดตามประสิทธิภาพ | id, user_id, employee_id, name, specialization | UUID, UUID, VARCHAR(20), VARCHAR(100), JSONB | UNIQUE(user_id), UNIQUE(employee_id) | PRIMARY(id), UNIQUE(user_id), UNIQUE(employee_id) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `user_id`: Foreign key to users table / คีย์ต่างประเทศไปยังตาราง users
- `employee_id`: Unique employee ID / รหัสพนักงานที่ไม่ซ้ำกัน
- `name`: Full name / ชื่อเต็ม
- `phone`: Phone number / หมายเลขโทรศัพท์
- `email`: Email address / ที่อยู่อีเมล
- `specialization`: JSONB array of specializations / อาร์เรย์ JSONB ของความเชี่ยวชาญ
- `hourly_rate`: Decimal hourly rate / อัตราต่อชั่วโมงทศนิยม
- `commission_rate`: Decimal commission rate / อัตราค่าคอมมิชชั่นทศนิยม
- `hire_date`: Employment start date / วันที่เริ่มงาน
- `status`: ENUM('active', 'inactive', 'on_leave') / สถานะ ENUM
- `performance_rating`: Decimal average rating / คะแนนเฉลี่ยทศนิยม
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต

### 4. Services Table | ตารางบริการ

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Service catalog with pricing and duration / แค็ตตาล็อกบริการพร้อมราคาและระยะเวลา | id, name, category, price, duration | UUID, VARCHAR(100), VARCHAR(50), DECIMAL, INTEGER | NOT NULL(name, price) | PRIMARY(id), INDEX(category), INDEX(price) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `name`: Service name / ชื่อบริการ
- `description`: Service description / คำอธิบายบริการ
- `category`: Service category / หมวดหมู่บริการ
- `price`: Base price / ราคาพื้นฐาน
- `duration`: Service duration in minutes / ระยะเวลาบริการเป็นนาที
- `difficulty_level`: ENUM('easy', 'medium', 'hard') / ระดับความยาก ENUM
- `required_skills`: JSONB array of required skills / อาร์เรย์ JSONB ของทักษะที่จำเป็น
- `is_active`: Boolean active status / สถานะการใช้งานบูลีน
- `sort_order`: Display order / ลำดับการแสดง
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต

### 5. Service Options Table | ตารางตัวเลือกบริการ

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Additional options for services / ตัวเลือกเพิ่มเติมสำหรับบริการ | id, service_id, name, price_modifier | UUID, UUID, VARCHAR(100), DECIMAL | NOT NULL(service_id, name) | PRIMARY(id), INDEX(service_id) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `service_id`: Foreign key to services table / คีย์ต่างประเทศไปยังตาราง services
- `name`: Option name / ชื่อตัวเลือก
- `description`: Option description / คำอธิบายตัวเลือก
- `price_modifier`: Price adjustment (+/-) / การปรับราคา (+/-)
- `is_required`: Boolean if option is mandatory / บูลีนว่าตัวเลือกบังคับหรือไม่
- `is_active`: Boolean active status / สถานะการใช้งานบูลีน
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต

### 6. Appointments Table | ตารางนัดหมาย

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Appointment scheduling and status tracking / การจัดตารางนัดหมายและการติดตามสถานะ | id, member_id, staff_id, appointment_date, status | UUID, UUID, UUID, TIMESTAMP, ENUM | NOT NULL(member_id, staff_id, appointment_date) | PRIMARY(id), INDEX(member_id), INDEX(staff_id), INDEX(appointment_date) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `member_id`: Foreign key to members table / คีย์ต่างประเทศไปยังตาราง members
- `staff_id`: Foreign key to staff table / คีย์ต่างประเทศไปยังตาราง staff
- `appointment_date`: Scheduled date and time / วันที่และเวลานัดหมาย
- `duration`: Total appointment duration / ระยะเวลานัดหมายทั้งหมด
- `status`: ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') / สถานะ ENUM
- `notes`: Appointment notes / หมายเหตุนัดหมาย
- `reminder_sent`: Boolean if reminder was sent / บูลีนว่าส่งการเตือนแล้วหรือไม่
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต
- `cancelled_at`: Cancellation timestamp / วันที่ยกเลิก
- `cancellation_reason`: Reason for cancellation / เหตุผลการยกเลิก

### 7. Appointment Services Table | ตารางบริการในนัดหมาย

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Services included in each appointment / บริการที่รวมอยู่ในแต่ละนัดหมาย | id, appointment_id, service_id, quantity, unit_price | UUID, UUID, UUID, INTEGER, DECIMAL | NOT NULL(appointment_id, service_id) | PRIMARY(id), INDEX(appointment_id) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `appointment_id`: Foreign key to appointments table / คีย์ต่างประเทศไปยังตาราง appointments
- `service_id`: Foreign key to services table / คีย์ต่างประเทศไปยังตาราง services
- `quantity`: Number of services / จำนวนบริการ
- `unit_price`: Price per unit / ราคาต่อหน่วย
- `total_price`: Total price for this service / ราคารวมสำหรับบริการนี้
- `notes`: Service-specific notes / หมายเหตุเฉพาะบริการ
- `created_at`: Timestamp / วันที่สร้าง

### 8. Promotions Table | ตารางโปรโมชั่น

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Promotion campaigns and rules / แคมเปญโปรโมชั่นและกฎ | id, name, type, start_date, end_date, is_active | UUID, VARCHAR(100), ENUM, DATE, DATE, BOOLEAN | NOT NULL(name, type, start_date) | PRIMARY(id), INDEX(start_date, end_date), INDEX(is_active) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `name`: Promotion name / ชื่อโปรโมชั่น
- `description`: Promotion description / คำอธิบายโปรโมชั่น
- `type`: ENUM('percentage', 'fixed_amount', 'bundle', 'points_multiplier') / ประเภท ENUM
- `start_date`: Promotion start date / วันที่เริ่มโปรโมชั่น
- `end_date`: Promotion end date / วันที่สิ้นสุดโปรโมชั่น
- `is_active`: Boolean active status / สถานะการใช้งานบูลีน
- `priority`: Integer priority level / ระดับความสำคัญจำนวนเต็ม
- `usage_limit`: Maximum usage count / จำนวนการใช้งานสูงสุด
- `usage_count`: Current usage count / จำนวนการใช้งานปัจจุบัน
- `conditions`: JSONB promotion conditions / เงื่อนไขโปรโมชั่น JSONB
- `rewards`: JSONB promotion rewards / รางวัลโปรโมชั่น JSONB
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต

### 9. Transactions Table | ตารางธุรกรรม

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Payment transactions and billing / ธุรกรรมการชำระเงินและการเรียกเก็บเงิน | id, appointment_id, member_id, total_amount, payment_status | UUID, UUID, UUID, DECIMAL, ENUM | NOT NULL(appointment_id, total_amount) | PRIMARY(id), INDEX(appointment_id), INDEX(member_id), INDEX(payment_status) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `appointment_id`: Foreign key to appointments table / คีย์ต่างประเทศไปยังตาราง appointments
- `member_id`: Foreign key to members table / คีย์ต่างประเทศไปยังตาราง members
- `total_amount`: Total transaction amount / ยอดเงินธุรกรรมทั้งหมด
- `subtotal`: Subtotal before discounts / ยอดรวมก่อนส่วนลด
- `discount_amount`: Total discount applied / ยอดส่วนลดที่ใช้ทั้งหมด
- `tax_amount`: Tax amount / ยอดภาษี
- `payment_method`: ENUM('cash', 'card', 'bank_transfer', 'points') / วิธีการชำระเงิน ENUM
- `payment_status`: ENUM('pending', 'completed', 'failed', 'refunded') / สถานะการชำระเงิน ENUM
- `payment_reference`: External payment reference / อ้างอิงการชำระเงินภายนอก
- `points_earned`: Points earned from transaction / แต้มที่ได้รับจากธุรกรรม
- `points_used`: Points used in transaction / แต้มที่ใช้ในธุรกรรม
- `created_at`: Timestamp / วันที่สร้าง
- `updated_at`: Timestamp / วันที่อัปเดต

### 10. Points History Table | ตารางประวัติแต้ม

| Purpose | Key Columns | Data Types | Constraints | Indexes |
|---------|-------------|------------|-------------|---------|
| Points earning and usage tracking / การติดตามการสะสมและการใช้แต้ม | id, member_id, points, type, reference_id | UUID, UUID, INTEGER, ENUM, UUID | NOT NULL(member_id, points, type) | PRIMARY(id), INDEX(member_id), INDEX(type), INDEX(created_at) |

**Fields:**
- `id`: UUID primary key / คีย์หลัก UUID
- `member_id`: Foreign key to members table / คีย์ต่างประเทศไปยังตาราง members
- `points`: Points amount (+/-) / จำนวนแต้ม (+/-)
- `type`: ENUM('earned', 'used', 'expired', 'refunded') / ประเภท ENUM
- `reference_id`: Reference to source transaction/appointment / อ้างอิงไปยังธุรกรรม/นัดหมายต้นทาง
- `description`: Points description / คำอธิบายแต้ม
- `expires_at`: Points expiration date / วันที่หมดอายุแต้ม
- `created_at`: Timestamp / วันที่สร้าง

## Entity Relationships | ความสัมพันธ์ระหว่างเอนทิตี้

### One-to-Many Relationships | ความสัมพันธ์ 1:N

1. **Users → Staff** (1:1) - Each user can have one staff record / ผู้ใช้แต่ละคนสามารถมีบันทึกพนักงานหนึ่งรายการ
2. **Members → Appointments** (1:N) - One member can have many appointments / สมาชิกหนึ่งคนสามารถมีนัดหมายหลายรายการ
3. **Staff → Appointments** (1:N) - One staff can handle many appointments / พนักงานหนึ่งคนสามารถจัดการนัดหมายหลายรายการ
4. **Services → Service Options** (1:N) - One service can have many options / บริการหนึ่งรายการสามารถมีตัวเลือกหลายรายการ
5. **Appointments → Appointment Services** (1:N) - One appointment can include many services / นัดหมายหนึ่งรายการสามารถรวมบริการหลายรายการ
6. **Appointments → Transactions** (1:1) - Each appointment has one transaction / นัดหมายแต่ละรายการมีการทำธุรกรรมหนึ่งรายการ
7. **Members → Points History** (1:N) - One member can have many points transactions / สมาชิกหนึ่งคนสามารถมีธุรกรรมแต้มหลายรายการ

### Many-to-Many Relationships | ความสัมพันธ์ N:N

1. **Appointments ↔ Services** (N:N) - Through Appointment Services table / ผ่านตาราง Appointment Services
2. **Members ↔ Promotions** (N:N) - Through promotion usage tracking / ผ่านการติดตามการใช้โปรโมชั่น

## Business Rules | กฎทางธุรกิจ

### Promotion Priority | ลำดับความสำคัญของโปรโมชั่น

1. **Exclusive promotions** have highest priority / โปรโมชั่นเฉพาะมีลำดับความสำคัญสูงสุด
2. **Percentage discounts** are applied before fixed amount / ส่วนลดเปอร์เซ็นต์จะใช้ก่อนจำนวนเงินคงที่
3. **Maximum one promotion** per transaction unless cumulative rules apply / สูงสุดหนึ่งโปรโมชั่นต่อธุรกรรม เว้นแต่กฎสะสมจะใช้
4. **Points usage** has lowest priority / การใช้แต้มมีลำดับความสำคัญต่ำสุด

### Duplicate Discount Prevention | การป้องกันส่วนลดซ้ำซ้อน

1. **Unique promotion codes** prevent duplicate application / รหัสโปรโมชั่นที่ไม่ซ้ำกันป้องกันการใช้งานซ้ำ
2. **Time-based restrictions** prevent multiple uses within same period / ข้อจำกัดตามเวลาป้องกันการใช้งานหลายครั้งในระยะเวลาเดียวกัน
3. **Member-level tracking** prevents individual overuse / การติดตามระดับสมาชิกป้องกันการใช้งานเกินขีดจำกัดของแต่ละคน

### Member Uniqueness | ความเป็นเอกลักษณ์ของสมาชิก

1. **Phone number** is the primary unique identifier / หมายเลขโทรศัพท์เป็นตัวระบุเฉพาะหลัก
2. **Email** is optional but must be unique if provided / อีเมลไม่บังคับแต่ต้องไม่ซ้ำกันหากให้มา
3. **Soft delete** preserves data integrity / การลบแบบ soft delete รักษาความสมบูรณ์ของข้อมูล

### Points Settlement Timing | เวลาการคำนวณแต้ม

1. **Points earned** immediately after successful payment / แต้มที่ได้รับทันทีหลังการชำระเงินสำเร็จ
2. **Points used** deducted before payment processing / แต้มที่ใช้หักก่อนการประมวลผลการชำระเงิน
3. **Points expiration** checked daily at midnight / ตรวจสอบการหมดอายุแต้มทุกวันตอนเที่ยงคืน
4. **Refund handling** reverses points transactions / การจัดการคืนเงินย้อนกลับธุรกรรมแต้ม

## Data Privacy and Masking | ความเป็นส่วนตัวและการปิดบังข้อมูล

### Minimal Data Collection | การเก็บข้อมูลแบบน้อยที่สุด

1. **Required fields only**: name, phone, service preferences / ฟิลด์ที่จำเป็นเท่านั้น: ชื่อ, โทรศัพท์, ความชอบบริการ
2. **Optional personal data**: email, date of birth, address / ข้อมูลส่วนตัวที่ไม่บังคับ: อีเมล, วันเกิด, ที่อยู่
3. **Marketing consent** required for promotional communications / ความยินยอมทางการตลาดจำเป็นสำหรับการสื่อสารโปรโมชั่น

### Data Masking Policies | นโยบายการปิดบังข้อมูล

1. **Phone numbers**: Show only last 4 digits in logs / หมายเลขโทรศัพท์: แสดงเฉพาะ 4 หลักสุดท้ายในบันทึก
2. **Email addresses**: Mask domain part in reports / ที่อยู่อีเมล: ปิดบังส่วนโดเมนในรายงาน
3. **Payment data**: Never store full card numbers / ข้อมูลการชำระเงิน: อย่าเก็บหมายเลขบัตรครบ
4. **Audit logs**: Exclude sensitive personal information / บันทึกการตรวจสอบ: ไม่รวมข้อมูลส่วนตัวที่ละเอียดอ่อน

## Dummy Data Scenarios | สถานการณ์ข้อมูลทดสอบ

### 1. New Member Registration | การลงทะเบียนสมาชิกใหม่
**Scenario**: First-time customer visits salon, provides basic information, gets registered in system / สถานการณ์: ลูกค้าใหม่มาเยี่ยมชมร้าน ให้ข้อมูลพื้นฐาน ลงทะเบียนในระบบ

**Data**: Member record with phone, name, marketing consent, 0 points balance / ข้อมูล: บันทึกสมาชิกพร้อมโทรศัพท์, ชื่อ, ความยินยอมทางการตลาด, แต้ม 0

### 2. First Visit Appointment | นัดหมายครั้งแรก
**Scenario**: New member books appointment for basic manicure service / สถานการณ์: สมาชิกใหม่จองนัดหมายสำหรับบริการทำเล็บพื้นฐาน

**Data**: Appointment with scheduled date, staff assignment, service selection / ข้อมูล: นัดหมายพร้อมวันที่กำหนด, การมอบหมายพนักงาน, การเลือกบริการ

### 3. Return Visit with Points | การกลับมาใช้บริการพร้อมแต้ม
**Scenario**: Returning member uses accumulated points for discount / สถานการณ์: สมาชิกที่กลับมาใช้แต้มที่สะสมเพื่อส่วนลด

**Data**: Transaction with points deduction, updated member points balance / ข้อมูล: ธุรกรรมพร้อมการหักแต้ม, ยอดแต้มสมาชิกที่อัปเดต

### 4. No-Show Handling | การจัดการไม่มาตามนัด
**Scenario**: Member doesn't show up for appointment, system marks as no-show / สถานการณ์: สมาชิกไม่มาตามนัด ระบบทำเครื่องหมายว่าไม่มาตามนัด

**Data**: Appointment status updated to 'no_show', member record flagged / ข้อมูล: สถานะนัดหมายอัปเดตเป็น 'no_show', บันทึกสมาชิกถูกทำเครื่องหมาย

### 5. Coupon Application | การใช้คูปอง
**Scenario**: Member applies promotional coupon during payment / สถานการณ์: สมาชิกใช้คูปองโปรโมชั่นระหว่างการชำระเงิน

**Data**: Transaction with discount applied, promotion usage tracked / ข้อมูล: ธุรกรรมพร้อมส่วนลดที่ใช้, การใช้โปรโมชั่นถูกติดตาม

### 6. Points Usage | การใช้แต้ม
**Scenario**: Member redeems points for free service upgrade / สถานการณ์: สมาชิกแลกแต้มสำหรับการอัปเกรดบริการฟรี

**Data**: Points history record, updated member balance, service modification / ข้อมูล: บันทึกประวัติแต้ม, ยอดคงเหลือสมาชิกที่อัปเดต, การแก้ไขบริการ

### 7. Staff Performance Tracking | การติดตามประสิทธิภาพพนักงาน
**Scenario**: System tracks staff completion rates and customer ratings / สถานการณ์: ระบบติดตามอัตราการทำงานเสร็จและคะแนนลูกค้าของพนักงาน

**Data**: Staff performance metrics, appointment completion records / ข้อมูล: ตัวชี้วัดประสิทธิภาพพนักงาน, บันทึกการทำงานนัดหมายเสร็จ

### 8. Promotion Campaign | แคมเปญโปรโมชั่น
**Scenario**: New promotion created for weekend services with 20% discount / สถานการณ์: สร้างโปรโมชั่นใหม่สำหรับบริการสุดสัปดาห์พร้อมส่วนลด 20%

**Data**: Promotion record with conditions, usage tracking setup / ข้อมูล: บันทึกโปรโมชั่นพร้อมเงื่อนไข, การตั้งค่าการติดตามการใช้งาน

### 9. Payment Failure and Retry | การชำระเงินล้มเหลวและการลองใหม่
**Scenario**: Card payment fails, member retries with different payment method / สถานการณ์: การชำระเงินด้วยบัตรล้มเหลว สมาชิกลองใหม่ด้วยวิธีการชำระเงินอื่น

**Data**: Failed transaction record, retry transaction with different method / ข้อมูล: บันทึกธุรกรรมที่ล้มเหลว, ธุรกรรมลองใหม่ด้วยวิธีการอื่น

### 10. Member Merge | การรวมสมาชิก
**Scenario**: Duplicate member records found, system merges data / สถานการณ์: พบบันทึกสมาชิกซ้ำ ระบบรวมข้อมูล

**Data**: Primary member record updated, duplicate marked as merged, data consolidation / ข้อมูล: บันทึกสมาชิกหลักอัปเดต, ข้อมูลซ้ำถูกทำเครื่องหมายว่าถูกรวม, การรวมข้อมูล



