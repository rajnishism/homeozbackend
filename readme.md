# 📊 Appointment Analytics API

This module provides **fast, accurate, dashboard-ready analytics** for appointments.
All analytics are **pre-calculated and stored daily**, so the frontend never runs heavy queries.

---

## 🧠 Core Concept

> **Appointments store raw data**  
> **Analytics store aggregated counts**

Analytics are updated **only after successful payment verification** to ensure **real business data**.

---

## 🗂️ What This Analytics System Tracks

- ✅ Total appointments per day
- ✅ Gender-wise counts
- ✅ Age-wise counts (exact age)
- ✅ Status-wise counts (paid, consult, medicine delivery, etc.)

---

## 🧩 How Analytics Are Updated

Analytics are updated **ONLY** when:

- Razorpay payment is verified successfully

❌ Failed payments are NOT counted  
❌ Pending orders are NOT counted

### Event Flow

```
Create Order
   ↓
Verify Payment
   ↓
Payment Success
   ↓
Update Analytics
```

---

## 📦 Database Collection

### Collection Name

```
AppointmentAnalytics
```

### One Document Represents

```
(date + analytics type)
```

---

## 📄 Example Documents

### Daily Total

```json
{
  "date": "2025-12-18",
  "type": "daily_total",
  "counts": {},
  "total": 17
}
```

### Gender Analytics

```json
{
  "date": "2025-12-18",
  "type": "gender",
  "counts": {
    "male": 9,
    "female": 8
  },
  "total": 17
}
```

### Age Analytics

```json
{
  "date": "2025-12-18",
  "type": "age",
  "counts": {
    "25": 3,
    "32": 5,
    "40": 2
  },
  "total": 17
}
```

### Status Analytics

```json
{
  "date": "2025-12-18",
  "type": "status",
  "counts": {
    "paid": 12,
    "consult": 3,
    "medicine_delivery": 2
  },
  "total": 17
}
```

---

## 🌐 API Endpoints

### Base URL

```
/api/analytics
```

---

## 1️⃣ Get Today’s Complete Analytics (Recommended)

### Endpoint

```
GET /api/analytics/today
```

### Description

Returns **all analytics for today** in one API call.

### Example Response

```json
{
  "date": "2025-12-18",
  "daily_total": 17,
  "gender": {
    "counts": { "male": 9, "female": 8 },
    "total": 17
  },
  "age": {
    "counts": { "25": 3, "32": 5, "40": 2 },
    "total": 17
  },
  "status": {
    "counts": {
      "paid": 12,
      "consult": 3,
      "medicine_delivery": 2
    },
    "total": 17
  }
}
```

---

## 🏁 Summary

- Analytics are **accurate**
- Analytics are **fast**
- Analytics are **dashboard-ready**
- Analytics reflect **real paid appointments**

---

**Homeoz Backend**
