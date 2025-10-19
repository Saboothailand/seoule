# Dashboard KPI & Widget Planning | การวางแผน KPI และวิดเจ็ตแดชบอร์ด

## Overview | ภาพรวม

This document defines the core KPIs and actionable widgets that store managers and staff will view daily to monitor salon performance and take immediate action.

เอกสารนี้นิยาม KPI หลักและวิดเจ็ตที่สามารถดำเนินการได้ที่ผู้จัดการร้านและพนักงานจะดูทุกวันเพื่อติดตามประสิทธิภาพร้านและดำเนินการทันที

## Widget Priority by Persona | ลำดับความสำคัญของวิดเจ็ตตามบุคลิกภาพ

### Manager Dashboard - Above the Fold | แดชบอร์ดผู้จัดการ - Above the Fold

| Priority | Widget Name | Description (EN/TH) | Action Required |
|----------|-------------|---------------------|-----------------|
| 1 | Today's Revenue | Real-time revenue tracking / การติดตามรายได้แบบเรียลไทม์ | Monitor daily targets |
| 2 | Appointment Status | Current appointments and no-shows / นัดหมายปัจจุบันและการไม่มาตามนัด | Handle no-shows |
| 3 | Staff Performance | Individual staff metrics / ตัวชี้วัดพนักงานแต่ละคน | Review performance |
| 4 | New Members | Today's new member registrations / การลงทะเบียนสมาชิกใหม่วันนี้ | Welcome new members |
| 5 | Service Popularity | Most booked services today / บริการที่จองมากที่สุดวันนี้ | Adjust staffing |

### Staff Dashboard - Above the Fold | แดชบอร์ดพนักงาน - Above the Fold

| Priority | Widget Name | Description (EN/TH) | Action Required |
|----------|-------------|---------------------|-----------------|
| 1 | My Appointments | Personal appointment schedule / ตารางนัดหมายส่วนตัว | Prepare for appointments |
| 2 | Today's Tasks | Confirmation calls, follow-ups / การโทรยืนยัน, การติดตาม | Complete tasks |
| 3 | Member Notes | Important member information / ข้อมูลสมาชิกที่สำคัญ | Review before service |
| 4 | Service Queue | Next appointments and preparation / นัดหมายถัดไปและการเตรียมพร้อม | Prepare services |
| 5 | Performance Today | Personal metrics for today / ตัวชี้วัดส่วนตัวสำหรับวันนี้ | Track progress |

## KPI Definition Document | เอกสารคำจำกัดความ KPI

### Revenue KPIs | KPI รายได้

| KPI Name | Definition (EN/TH) | Formula | Data Source | Alert Threshold |
|----------|-------------------|---------|--------------|-----------------|
| Daily Revenue | Total revenue earned today / รายได้รวมที่ได้รับวันนี้ | SUM(transactions.total_amount) WHERE DATE(created_at) = TODAY | transactions table | < 80% of daily target |
| Average Ticket Price | Average spending per customer / การใช้จ่ายเฉลี่ยต่อลูกค้า | SUM(total_amount) / COUNT(DISTINCT member_id) | transactions table | < previous week average |
| Revenue Growth | Month-over-month revenue change / การเปลี่ยนแปลงรายได้เดือนต่อเดือน | (Current month - Previous month) / Previous month * 100 | transactions table | < 5% growth |
| Service Revenue Mix | Revenue breakdown by service category / การแบ่งรายได้ตามหมวดหมู่บริการ | Revenue per category / Total revenue * 100 | transactions + appointment_services | Any category > 60% |

### Customer KPIs | KPI ลูกค้า

| KPI Name | Definition (EN/TH) | Formula | Data Source | Alert Threshold |
|----------|-------------------|---------|--------------|-----------------|
| New Members | New member registrations today / การลงทะเบียนสมาชิกใหม่วันนี้ | COUNT(*) WHERE DATE(created_at) = TODAY | members table | < 3 per day |
| Member Retention | Percentage of returning customers / เปอร์เซ็นต์ลูกค้าที่กลับมา | (Returning members / Total members) * 100 | members + appointments | < 60% |
| No-Show Rate | Percentage of missed appointments / เปอร์เซ็นต์นัดหมายที่พลาด | (No-show appointments / Total appointments) * 100 | appointments table | > 15% |
| Customer Satisfaction | Average rating from feedback / คะแนนเฉลี่ยจากความคิดเห็น | AVG(rating) WHERE rating IS NOT NULL | feedback table | < 4.0 |

### Operational KPIs | KPI การดำเนินงาน

| KPI Name | Definition (EN/TH) | Formula | Data Source | Alert Threshold |
|----------|-------------------|---------|--------------|-----------------|
| Staff Utilization | Percentage of staff time utilized / เปอร์เซ็นต์เวลาพนักงานที่ใช้ | (Scheduled hours / Available hours) * 100 | appointments + staff_schedules | < 70% |
| Average Service Time | Average duration per service / ระยะเวลาเฉลี่ยต่อบริการ | AVG(service_duration) | appointment_services table | > 120% of standard |
| Appointment Capacity | Percentage of available slots filled / เปอร์เซ็นต์ช่องว่างที่มีอยู่ที่เต็ม | (Booked slots / Total slots) * 100 | appointments + staff_schedules | < 80% |
| Points Redemption Rate | Percentage of points redeemed / เปอร์เซ็นต์แต้มที่แลก | (Points used / Points earned) * 100 | points_history table | < 30% |

## Chart Recommendations | คำแนะนำแผนภูมิ

### Revenue Charts | แผนภูมิรายได้

| Chart Type | Use Case | Rationale |
|------------|----------|-----------|
| **Line Chart** | Daily revenue trend over time / แนวโน้มรายได้รายวันตามเวลา | Shows growth patterns and seasonality / แสดงรูปแบบการเติบโตและฤดูกาล |
| **Bar Chart** | Revenue by service category / รายได้ตามหมวดหมู่บริการ | Easy comparison between categories / เปรียบเทียบระหว่างหมวดหมู่ได้ง่าย |
| **Donut Chart** | Payment method distribution / การกระจายวิธีการชำระเงิน | Shows payment preferences / แสดงความชอบวิธีการชำระเงิน |

### Customer Charts | แผนภูมิลูกค้า

| Chart Type | Use Case | Rationale |
|------------|----------|-----------|
| **Heatmap** | Appointment patterns by day/hour / รูปแบบนัดหมายตามวัน/ชั่วโมง | Identifies peak times and staffing needs / ระบุเวลาที่มีผู้ใช้มากและความต้องการพนักงาน |
| **Bar Chart** | New vs returning customers / ลูกค้าใหม่เทียบกับลูกค้าเก่า | Shows customer acquisition vs retention / แสดงการได้ลูกค้าใหม่เทียบกับการรักษาลูกค้าเก่า |
| **Line Chart** | No-show rate trend / แนวโน้มอัตราไม่มาตามนัด | Tracks improvement over time / ติดตามการปรับปรุงตามเวลา |

### Operational Charts | แผนภูมิการดำเนินงาน

| Chart Type | Use Case | Rationale |
|------------|----------|-----------|
| **Gauge Chart** | Staff utilization percentage / เปอร์เซ็นต์การใช้งานพนักงาน | Quick visual of capacity / การมองเห็นความจุอย่างรวดเร็ว |
| **Bar Chart** | Staff performance comparison / การเปรียบเทียบประสิทธิภาพพนักงาน | Easy ranking and identification of top performers / การจัดอันดับและระบุผู้ทำผลงานดีได้ง่าย |
| **Area Chart** | Service duration trends / แนวโน้มระยะเวลาบริการ | Shows efficiency improvements / แสดงการปรับปรุงประสิทธิภาพ |

## Alert Thresholds and Notifications | เกณฑ์การแจ้งเตือนและการแจ้งเตือน

### Revenue Alerts | การแจ้งเตือนรายได้

| Alert Type | Threshold | Notification Method | Action Required |
|------------|-----------|-------------------|-----------------|
| Low Daily Revenue | < 80% of target | In-app badge + Email | Review bookings and promotions |
| Declining Growth | < 5% month-over-month | Email + Manager notification | Analyze market trends |
| Payment Failures | > 5% of transactions | In-app alert + SMS | Check payment system |

### Customer Alerts | การแจ้งเตือนลูกค้า

| Alert Type | Threshold | Notification Method | Action Required |
|------------|-----------|-------------------|-----------------|
| High No-Show Rate | > 15% | In-app badge + Email | Review reminder system |
| Low New Members | < 3 per day | Daily email report | Increase marketing efforts |
| Poor Satisfaction | < 4.0 rating | Immediate notification | Address service issues |

### Operational Alerts | การแจ้งเตือนการดำเนินงาน

| Alert Type | Threshold | Notification Method | Action Required |
|------------|-----------|-------------------|-----------------|
| Low Staff Utilization | < 70% | Manager dashboard | Adjust scheduling |
| Overbooked Schedule | > 100% capacity | In-app alert | Reschedule appointments |
| Service Delays | > 120% of standard time | Real-time notification | Review process efficiency |

## Today's To-Do Rules | กฎสิ่งที่ต้องทำวันนี้

### Appointment Management | การจัดการนัดหมาย

| Task | Trigger | Frequency | Action |
|------|---------|-----------|--------|
| **Confirmation Calls** | 24 hours before appointment / 24 ชั่วโมงก่อนนัดหมาย | Daily | Call members to confirm |
| **No-Show Follow-up** | 30 minutes after missed appointment / 30 นาทีหลังพลาดนัดหมาย | Real-time | Call and reschedule |
| **Review Requests** | 2 hours after completed service / 2 ชั่วโมงหลังบริการเสร็จ | Daily | Send review request |
| **Points Expiration Alert** | 7 days before points expire / 7 วันก่อนแต้มหมดอายุ | Daily | Notify member |

### Member Management | การจัดการสมาชิก

| Task | Trigger | Frequency | Action |
|------|---------|-----------|--------|
| **Welcome New Members** | New registration / การลงทะเบียนใหม่ | Real-time | Send welcome message |
| **Birthday Wishes** | Member birthday / วันเกิดสมาชิก | Daily | Send birthday offer |
| **Loyalty Program Updates** | Points balance changes / การเปลี่ยนแปลงยอดแต้ม | Real-time | Update member status |
| **Marketing Consent Follow-up** | 30 days without consent / 30 วันโดยไม่ยินยอม | Weekly | Request marketing permission |

### Staff Management | การจัดการพนักงาน

| Task | Trigger | Frequency | Action |
|------|---------|-----------|--------|
| **Performance Review** | End of shift / สิ้นสุดกะ | Daily | Review daily metrics |
| **Schedule Optimization** | Low utilization detected / ตรวจพบการใช้งานต่ำ | Real-time | Adjust next day schedule |
| **Training Reminders** | New service added / เพิ่มบริการใหม่ | As needed | Schedule training session |
| **Goal Setting** | Monthly review / การทบทวนรายเดือน | Monthly | Set performance goals |

## Dashboard UI Labels | ป้ายกำกับ UI ของแดชบอร์ด

### Navigation | การนำทาง

```json
{
  "navigation": {
    "dashboard": {
      "en": "Dashboard",
      "th": "แดชบอร์ด"
    },
    "appointments": {
      "en": "Appointments",
      "th": "การนัดหมาย"
    },
    "members": {
      "en": "Members",
      "th": "สมาชิก"
    },
    "services": {
      "en": "Services",
      "th": "บริการ"
    },
    "reports": {
      "en": "Reports",
      "th": "รายงาน"
    },
    "settings": {
      "en": "Settings",
      "th": "การตั้งค่า"
    }
  }
}
```

### Widget Headers | หัวข้อวิดเจ็ต

```json
{
  "widgets": {
    "todayRevenue": {
      "en": "Today's Revenue",
      "th": "รายได้วันนี้"
    },
    "appointmentStatus": {
      "en": "Appointment Status",
      "th": "สถานะนัดหมาย"
    },
    "staffPerformance": {
      "en": "Staff Performance",
      "th": "ประสิทธิภาพพนักงาน"
    },
    "newMembers": {
      "en": "New Members",
      "th": "สมาชิกใหม่"
    },
    "servicePopularity": {
      "en": "Popular Services",
      "th": "บริการยอดนิยม"
    },
    "myAppointments": {
      "en": "My Appointments",
      "th": "นัดหมายของฉัน"
    },
    "todaysTasks": {
      "en": "Today's Tasks",
      "th": "งานวันนี้"
    },
    "memberNotes": {
      "en": "Member Notes",
      "th": "หมายเหตุสมาชิก"
    },
    "serviceQueue": {
      "en": "Service Queue",
      "th": "คิวบริการ"
    }
  }
}
```

### Action Buttons | ปุ่มดำเนินการ

```json
{
  "actions": {
    "viewDetails": {
      "en": "View Details",
      "th": "ดูรายละเอียด"
    },
    "takeAction": {
      "en": "Take Action",
      "th": "ดำเนินการ"
    },
    "refresh": {
      "en": "Refresh",
      "th": "รีเฟรช"
    },
    "export": {
      "en": "Export",
      "th": "ส่งออก"
    },
    "filter": {
      "en": "Filter",
      "th": "กรอง"
    },
    "settings": {
      "en": "Settings",
      "th": "การตั้งค่า"
    }
  }
}
```

### Status Indicators | ตัวบ่งชี้สถานะ

```json
{
  "status": {
    "scheduled": {
      "en": "Scheduled",
      "th": "นัดหมายแล้ว"
    },
    "confirmed": {
      "en": "Confirmed",
      "th": "ยืนยันแล้ว"
    },
    "inProgress": {
      "en": "In Progress",
      "th": "กำลังดำเนินการ"
    },
    "completed": {
      "en": "Completed",
      "th": "เสร็จสิ้น"
    },
    "cancelled": {
      "en": "Cancelled",
      "th": "ยกเลิก"
    },
    "noShow": {
      "en": "No Show",
      "th": "ไม่มาตามนัด"
    },
    "high": {
      "en": "High",
      "th": "สูง"
    },
    "medium": {
      "en": "Medium",
      "th": "ปานกลาง"
    },
    "low": {
      "en": "Low",
      "th": "ต่ำ"
    }
  }
}
```

## Drill-Down Paths | เส้นทาง Drill-Down

### Revenue Drill-Down | การเจาะลึกรายได้

1. **Daily Revenue** → **Revenue by Hour** → **Revenue by Service** → **Individual Transactions**
2. **Service Category Revenue** → **Top Services** → **Service Performance** → **Staff Performance**

### Customer Drill-Down | การเจาะลึกลูกค้า

1. **New Members** → **Member Details** → **Appointment History** → **Service Preferences**
2. **No-Show Rate** → **No-Show Members** → **Member Profile** → **Contact History**

### Operational Drill-Down | การเจาะลึกการดำเนินงาน

1. **Staff Utilization** → **Individual Staff** → **Appointment Schedule** → **Service Details**
2. **Service Queue** → **Next Appointment** → **Member Information** → **Service Requirements**

## Real-Time Updates | การอัปเดตแบบเรียลไทม์

### WebSocket Events | เหตุการณ์ WebSocket

```json
{
  "events": {
    "appointmentCreated": {
      "en": "New appointment created",
      "th": "สร้างนัดหมายใหม่"
    },
    "appointmentUpdated": {
      "en": "Appointment updated",
      "th": "อัปเดตนัดหมาย"
    },
    "appointmentCancelled": {
      "en": "Appointment cancelled",
      "th": "ยกเลิกนัดหมาย"
    },
    "paymentReceived": {
      "en": "Payment received",
      "th": "รับการชำระเงิน"
    },
    "memberRegistered": {
      "en": "New member registered",
      "th": "ลงทะเบียนสมาชิกใหม่"
    },
    "pointsEarned": {
      "en": "Points earned",
      "th": "ได้รับแต้ม"
    },
    "pointsUsed": {
      "en": "Points used",
      "th": "ใช้แต้ม"
    }
  }
}
```

### Auto-Refresh Intervals | ช่วงเวลาการรีเฟรชอัตโนมัติ

| Widget | Refresh Interval | Reason |
|--------|------------------|--------|
| Today's Revenue | 5 minutes | Real-time financial tracking |
| Appointment Status | 1 minute | Critical operational data |
| Staff Performance | 15 minutes | Performance metrics |
| New Members | 2 minutes | Customer acquisition |
| Service Queue | 30 seconds | Operational efficiency |
| My Appointments | 1 minute | Personal schedule |



