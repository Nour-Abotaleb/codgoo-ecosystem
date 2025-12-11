# Codgoo Ecosystem API Documentation

This document provides comprehensive API documentation for all endpoints required by the Codgoo Ecosystem application, including authentication, dashboard, domains, and server management features.

## Table of Contents

1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Domains](#domains)
4. [Servers](#servers)
5. [Websites](#websites)
6. [Support Tickets](#support-tickets)
7. [Billing](#billing)
8. [General Information](#general-information)

---

## Authentication

### Base URL
```
POST /api/auth
```

### 1. User Registration

Register a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "company": "string",
  "phone": "string",
  "rememberMe": boolean
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "company": "string",
    "phone": "string"
  },
  "token": "string",
  "refreshToken": "string",
  "expiresIn": number
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email already exists

---

### 2. User Login

Authenticate user and receive access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "company": "string"
  },
  "token": "string",
  "refreshToken": "string",
  "expiresIn": number
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation errors

---

### 3. Social Authentication

Authenticate using social providers (Google, Facebook, Apple).

**Endpoint:** `POST /api/auth/social/:provider`

**Path Parameters:**
- `provider`: `google` | `facebook` | `apple`

**Request Body:**
```json
{
  "token": "string",
  "providerId": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "token": "string",
  "refreshToken": "string",
  "expiresIn": number
}
```

---

### 4. Refresh Token

Refresh access token using refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:** `200 OK`
```json
{
  "token": "string",
  "refreshToken": "string",
  "expiresIn": number
}
```

---

### 5. Logout

Invalidate user session.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. Get Current User

Get authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "company": "string",
  "phone": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

---

## Dashboard

### Base URL
```
GET /api/dashboard
```

### 1. Get Dashboard Overview

Get all dashboard data including stats, products, domains, sites, tickets, and news.

**Endpoint:** `GET /api/dashboard/overview`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `appId` (optional): `cloud` | `app` | `software`

**Response:** `200 OK`
```json
{
  "stats": [
    {
      "id": "string",
      "label": "string",
      "value": "string"
    }
  ],
  "products": [
    {
      "id": "string",
      "server": "string",
      "type": "string",
      "cost": "string",
      "renewal": "string"
    }
  ],
  "domains": [
    {
      "id": "string",
      "name": "string",
      "registrationDate": "string",
      "nextDueDate": "string",
      "autoRenew": boolean,
      "status": "Active" | "Pending" | "Fraud"
    }
  ],
  "sites": [
    {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  ],
  "tickets": [
    {
      "id": "string",
      "title": "string",
      "tag": "string",
      "date": "string",
      "time": "string"
    }
  ],
  "news": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "time": "string",
      "image": "string"
    }
  ]
}
```

---

### 2. Get Dashboard Stats

Get dashboard statistics.

**Endpoint:** `GET /api/dashboard/stats`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "activeHosting": number,
  "activeTickets": number,
  "dueInvoices": number,
  "registeredDomains": number
}
```

---

### 3. Get Dashboard Hero Content

Get hero section content for dashboard.

**Endpoint:** `GET /api/dashboard/hero`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `appId` (optional): `cloud` | `app` | `software`

**Response:** `200 OK`
```json
{
  "title": "string",
  "description": "string",
  "highlights": ["string"],
  "priceLabel": "string",
  "price": "string",
  "ctaLabel": "string",
  "gradient": "string",
  "backgroundImage": "string",
  "backgroundImageDark": "string"
}
```

---

## Domains

### Base URL
```
/api/domains
```

### 1. List Domains

Get paginated list of user domains.

**Endpoint:** `GET /api/domains`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 20)
- `search` (optional): string
- `status` (optional): `Active` | `Pending` | `Fraud`
- `autoRenew` (optional): boolean

**Response:** `200 OK`
```json
{
  "domains": [
    {
      "id": "string",
      "name": "string",
      "registrationDate": "string",
      "nextDueDate": "string",
      "autoRenew": boolean,
      "status": "Active" | "Pending" | "Fraud"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

### 2. Get Domain Details

Get detailed information about a specific domain.

**Endpoint:** `GET /api/domains/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "registrationDate": "string",
  "nextDueDate": "string",
  "expirationDate": "string",
  "autoRenew": boolean,
  "status": "Active" | "Pending" | "Fraud",
  "nameservers": [
    {
      "id": "string",
      "hostname": "string",
      "status": "Active" | "Inactive"
    }
  ],
  "dnsRecords": [
    {
      "id": "string",
      "type": "A" | "AAAA" | "CNAME" | "MX" | "TXT",
      "name": "string",
      "value": "string",
      "ttl": number
    }
  ],
  "contactInfo": {
    "email": "string",
    "name": "string",
    "phone": "string"
  },
  "privacyProtection": {
    "enabled": boolean,
    "expiresAt": "string"
  },
  "brandProtection": {
    "trademarkMonitoring": boolean,
    "domainLock": "string",
    "expiryAlerts": boolean
  }
}
```

---

### 3. Search Domain Availability

Check if a domain is available for registration.

**Endpoint:** `GET /api/domains/search`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `domain`: string (required)
- `tld`: string (optional, default: ".com")

**Response:** `200 OK`
```json
{
  "domain": "string",
  "available": boolean,
  "price": "string",
  "priceValue": number,
  "suggestions": [
    {
      "domain": "string",
      "available": boolean,
      "price": "string",
      "priceValue": number
    }
  ]
}
```

---

### 4. Register Domain

Register a new domain.

**Endpoint:** `POST /api/domains/register`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "domain": "string",
  "duration": number,
  "addOns": [
    {
      "id": "privacy" | "email" | "security" | "backup",
      "enabled": boolean
    }
  ],
  "contactInfo": {
    "email": "string",
    "name": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "country": "string",
    "postalCode": "string"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "domain": "string",
  "status": "Pending",
  "orderId": "string",
  "total": number,
  "currency": "string"
}
```

---

### 5. Update Domain

Update domain settings.

**Endpoint:** `PUT /api/domains/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "autoRenew": boolean,
  "contactInfo": {
    "email": "string",
    "name": "string",
    "phone": "string"
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "autoRenew": boolean,
  "updatedAt": "string"
}
```

---

### 6. Delete Domain

Delete a domain (cancel registration).

**Endpoint:** `DELETE /api/domains/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Response:** `200 OK`
```json
{
  "message": "Domain deleted successfully"
}
```

---

### 7. Manage Nameservers

Update nameservers for a domain.

**Endpoint:** `PUT /api/domains/:id/nameservers`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "nameservers": [
    {
      "hostname": "string"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "nameservers": [
    {
      "id": "string",
      "hostname": "string",
      "status": "Active"
    }
  ],
  "updatedAt": "string"
}
```

---

### 8. Update Auto-Renewal

Toggle auto-renewal for a domain.

**Endpoint:** `PATCH /api/domains/:id/auto-renewal`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "enabled": boolean
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "autoRenew": boolean,
  "updatedAt": "string"
}
```

---

### 9. Update Contact Information

Update domain contact information.

**Endpoint:** `PUT /api/domains/:id/contact`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "postalCode": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "contactInfo": {
    "email": "string",
    "name": "string",
    "phone": "string"
  },
  "updatedAt": "string"
}
```

---

### 10. Renew Domain

Renew a domain registration.

**Endpoint:** `POST /api/domains/:id/renew`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "duration": number
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "nextDueDate": "string",
  "orderId": "string",
  "total": number,
  "currency": "string"
}
```

---

### 11. Get Domain DNS Records

Get DNS records for a domain.

**Endpoint:** `GET /api/domains/:id/dns`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Response:** `200 OK`
```json
{
  "records": [
    {
      "id": "string",
      "type": "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS",
      "name": "string",
      "value": "string",
      "ttl": number,
      "priority": number
    }
  ]
}
```

---

### 12. Update Domain DNS Records

Update DNS records for a domain.

**Endpoint:** `PUT /api/domains/:id/dns`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "records": [
    {
      "type": "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS",
      "name": "string",
      "value": "string",
      "ttl": number,
      "priority": number
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "records": [
    {
      "id": "string",
      "type": "string",
      "name": "string",
      "value": "string",
      "ttl": number
    }
  ],
  "updatedAt": "string"
}
```

---

### 13. Update Domain Privacy Protection

Update privacy protection settings for a domain.

**Endpoint:** `PATCH /api/domains/:id/privacy`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "enabled": boolean
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "privacyProtection": {
    "enabled": boolean,
    "expiresAt": "string"
  },
  "updatedAt": "string"
}
```

---

### 14. Update Brand Protection

Update brand protection settings for a domain.

**Endpoint:** `PATCH /api/domains/:id/brand-protection`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Domain ID

**Request Body:**
```json
{
  "trademarkMonitoring": boolean,
  "domainLock": "string",
  "expiryAlerts": boolean
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "brandProtection": {
    "trademarkMonitoring": boolean,
    "domainLock": "string",
    "expiryAlerts": boolean
  },
  "updatedAt": "string"
}
```

---

## Servers

### Base URL
```
/api/servers
```

### 1. List Servers

Get paginated list of user servers.

**Endpoint:** `GET /api/servers`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 20)
- `search` (optional): string
- `status` (optional): `Active` | `Pending`
- `plan` (optional): string

**Response:** `200 OK`
```json
{
  "servers": [
    {
      "id": "string",
      "product": "string",
      "plan": "string",
      "pricing": "string",
      "billingCycle": "string",
      "nextDueDate": "string",
      "status": "Active" | "Pending"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

### 2. Get Server Details

Get detailed information about a specific server.

**Endpoint:** `GET /api/servers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "product": "string",
  "plan": "string",
  "pricing": "string",
  "billingCycle": "string",
  "nextDueDate": "string",
  "status": "Active" | "Pending",
  "createdOn": "string",
  "renewalDate": "string",
  "cost": "string",
  "ipAddress": "string",
  "operatingSystem": "string",
  "summary": {
    "createdOn": "string",
    "renewalDate": "string",
    "cost": "string",
    "ipAddress": "string",
    "os": "string"
  }
}
```

---

### 3. Create Server

Order a new server.

**Endpoint:** `POST /api/servers`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "product": "string",
  "plan": "string",
  "billingCycle": "Monthly" | "Quarterly" | "Semi-Annually" | "Annually" | "Triennially",
  "operatingSystem": "string",
  "paymentMethodId": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "product": "string",
  "plan": "string",
  "status": "Pending",
  "orderId": "string",
  "total": number,
  "currency": "string"
}
```

---

### 4. Update Server

Update server settings.

**Endpoint:** `PUT /api/servers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Request Body:**
```json
{
  "plan": "string",
  "autoRenewal": boolean
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "plan": "string",
  "autoRenewal": boolean,
  "updatedAt": "string"
}
```

---

### 5. Delete Server

Cancel/delete a server.

**Endpoint:** `DELETE /api/servers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "message": "Server deleted successfully"
}
```

---

### 6. Get Server Usage Metrics

Get resource usage metrics for a server.

**Endpoint:** `GET /api/servers/:id/metrics`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` (default: `day`)

**Response:** `200 OK`
```json
{
  "memory": {
    "used": "string",
    "total": "string",
    "percent": number
  },
  "bandwidth": {
    "used": "string",
    "total": "string",
    "percent": number
  },
  "disk": {
    "used": "string",
    "total": "string",
    "percent": number
  },
  "backup": {
    "used": "string",
    "total": "string",
    "percent": number
  }
}
```

---

### 7. Get Server Websites

Get list of websites hosted on a server.

**Endpoint:** `GET /api/servers/:id/websites`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "websites": [
    {
      "id": "string",
      "domain": "string",
      "status": "Active" | "Suspended" | "Inactive",
      "platform": "string",
      "ssl": "Active" | "Inactive",
      "lastBackup": "string"
    }
  ]
}
```

---

### 8. Get Server Billing Information

Get billing details for a server.

**Endpoint:** `GET /api/servers/:id/billing`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "plan": "string",
  "expiryDate": "string",
  "autoRenewal": boolean,
  "paymentMethod": {
    "id": "string",
    "type": "Credit Card" | "PayPal" | "Bank Transfer",
    "last4": "string",
    "brand": "string"
  },
  "billingHistory": [
    {
      "id": "string",
      "date": "string",
      "amount": number,
      "currency": "string",
      "status": "Paid" | "Pending" | "Failed"
    }
  ]
}
```

---

### 9. Renew Server

Renew server subscription.

**Endpoint:** `POST /api/servers/:id/renew`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Request Body:**
```json
{
  "duration": number,
  "billingCycle": "Monthly" | "Quarterly" | "Semi-Annually" | "Annually" | "Triennially"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "renewalDate": "string",
  "orderId": "string",
  "total": number,
  "currency": "string"
}
```

---

### 10. Update Payment Method

Update payment method for server billing.

**Endpoint:** `PUT /api/servers/:id/payment-method`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Request Body:**
```json
{
  "paymentMethodId": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "paymentMethod": {
    "id": "string",
    "type": "string",
    "last4": "string"
  },
  "updatedAt": "string"
}
```

---

### 11. Get Server Backups

Get backup information for a server.

**Endpoint:** `GET /api/servers/:id/backups`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "settings": {
    "frequency": "Daily" | "Weekly" | "Monthly",
    "retention": number,
    "expiresAt": "string"
  },
  "backups": [
    {
      "id": "string",
      "date": "string",
      "size": "string",
      "status": "Completed" | "Failed" | "In Progress"
    }
  ]
}
```

---

### 12. Update Server Backup Settings

Update backup configuration for a server.

**Endpoint:** `PUT /api/servers/:id/backups`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Request Body:**
```json
{
  "frequency": "Daily" | "Weekly" | "Monthly",
  "retention": number
}
```

**Response:** `200 OK`
```json
{
  "settings": {
    "frequency": "string",
    "retention": number,
    "expiresAt": "string"
  },
  "updatedAt": "string"
}
```

---

### 13. Get Server Security Settings

Get security configuration for a server.

**Endpoint:** `GET /api/servers/:id/security`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "sslCertificate": {
    "status": "Active" | "Inactive" | "Expired",
    "expiresAt": "string"
  },
  "securityScan": {
    "status": "No Threats" | "Threats Found",
    "lastScan": "string"
  },
  "firewall": {
    "enabled": boolean,
    "rules": number
  }
}
```

---

### 14. Server Panel Access

Get panel access credentials/URL.

**Endpoint:** `GET /api/servers/:id/panel`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "url": "string",
  "username": "string",
  "temporaryPassword": "string",
  "expiresAt": "string"
}
```

---

### 15. Server SSH Access

Get SSH access information.

**Endpoint:** `GET /api/servers/:id/ssh`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Server ID

**Response:** `200 OK`
```json
{
  "enabled": boolean,
  "host": "string",
  "port": number,
  "username": "string",
  "key": "string"
}
```

---

## Websites

### Base URL
```
/api/websites
```

### 1. List Websites

Get list of all user websites.

**Endpoint:** `GET /api/websites`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `serverId` (optional): string
- `status` (optional): `Active` | `Suspended` | "Inactive"

**Response:** `200 OK`
```json
{
  "websites": [
    {
      "id": "string",
      "domain": "string",
      "serverId": "string",
      "status": "Active" | "Suspended" | "Inactive",
      "platform": "string",
      "ssl": "Active" | "Inactive",
      "lastBackup": "string"
    }
  ]
}
```

---

### 2. Get Website Details

Get detailed information about a website.

**Endpoint:** `GET /api/websites/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Website ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "domain": "string",
  "serverId": "string",
  "status": "Active" | "Suspended" | "Inactive",
  "platform": "string",
  "ssl": {
    "status": "Active" | "Inactive",
    "expiresAt": "string"
  },
  "lastBackup": "string",
  "createdAt": "string"
}
```

---

### 3. Create Website

Add a new website to a server.

**Endpoint:** `POST /api/websites`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "domain": "string",
  "serverId": "string",
  "platform": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "domain": "string",
  "serverId": "string",
  "status": "Pending",
  "platform": "string"
}
```

---

### 4. Update Website

Update website settings.

**Endpoint:** `PUT /api/websites/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Website ID

**Request Body:**
```json
{
  "platform": "string",
  "ssl": boolean
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "platform": "string",
  "ssl": {
    "status": "Active",
    "expiresAt": "string"
  },
  "updatedAt": "string"
}
```

---

### 5. Delete Website

Remove a website.

**Endpoint:** `DELETE /api/websites/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Website ID

**Response:** `200 OK`
```json
{
  "message": "Website deleted successfully"
}
```

---

## Support Tickets

### Base URL
```
/api/tickets
```

### 1. List Support Tickets

Get paginated list of support tickets.

**Endpoint:** `GET /api/tickets`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 20)
- `status` (optional): `Open` | `Closed` | `Pending`
- `tag` (optional): string

**Response:** `200 OK`
```json
{
  "tickets": [
    {
      "id": "string",
      "title": "string",
      "tag": "string",
      "status": "Open" | "Closed" | "Pending",
      "date": "string",
      "time": "string",
      "priority": "Low" | "Medium" | "High" | "Urgent"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

### 2. Get Ticket Details

Get detailed information about a support ticket.

**Endpoint:** `GET /api/tickets/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Ticket ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "tag": "string",
  "status": "Open" | "Closed" | "Pending",
  "priority": "Low" | "Medium" | "High" | "Urgent",
  "date": "string",
  "time": "string",
  "replies": [
    {
      "id": "string",
      "message": "string",
      "author": "string",
      "date": "string",
      "time": "string"
    }
  ]
}
```

---

### 3. Create Support Ticket

Create a new support ticket.

**Endpoint:** `POST /api/tickets`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "tag": "string",
  "priority": "Low" | "Medium" | "High" | "Urgent"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "title": "string",
  "status": "Open",
  "date": "string",
  "time": "string"
}
```

---

### 4. Reply to Ticket

Add a reply to a support ticket.

**Endpoint:** `POST /api/tickets/:id/replies`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "message": "string",
  "author": "string",
  "date": "string",
  "time": "string"
}
```

---

### 5. Close Ticket

Close a support ticket.

**Endpoint:** `PATCH /api/tickets/:id/close`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Ticket ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "status": "Closed",
  "closedAt": "string"
}
```

---

## Billing

### Base URL
```
/api/billing
```

### 1. Get Invoices

Get paginated list of invoices.

**Endpoint:** `GET /api/billing/invoices`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 20)
- `status` (optional): `Paid` | `Pending` | `Overdue`

**Response:** `200 OK`
```json
{
  "invoices": [
    {
      "id": "string",
      "number": "string",
      "amount": number,
      "currency": "string",
      "status": "Paid" | "Pending" | "Overdue",
      "dueDate": "string",
      "createdAt": "string"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

### 2. Get Invoice Details

Get detailed information about an invoice.

**Endpoint:** `GET /api/billing/invoices/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Invoice ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "number": "string",
  "amount": number,
  "currency": "string",
  "status": "Paid" | "Pending" | "Overdue",
  "dueDate": "string",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "price": number,
      "total": number
    }
  ],
  "createdAt": "string"
}
```

---

### 3. Get Payment Methods

Get list of saved payment methods.

**Endpoint:** `GET /api/billing/payment-methods`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "paymentMethods": [
    {
      "id": "string",
      "type": "Credit Card" | "PayPal" | "Bank Transfer",
      "last4": "string",
      "brand": "string",
      "expiryMonth": number,
      "expiryYear": number,
      "isDefault": boolean
    }
  ]
}
```

---

### 4. Add Payment Method

Add a new payment method.

**Endpoint:** `POST /api/billing/payment-methods`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "type": "Credit Card" | "PayPal",
  "cardNumber": "string",
  "expiryMonth": number,
  "expiryYear": number,
  "cvv": "string",
  "name": "string",
  "isDefault": boolean
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "type": "string",
  "last4": "string",
  "brand": "string",
  "isDefault": boolean
}
```

---

### 5. Delete Payment Method

Remove a payment method.

**Endpoint:** `DELETE /api/billing/payment-methods/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Payment Method ID

**Response:** `200 OK`
```json
{
  "message": "Payment method deleted successfully"
}
```

---

### 6. Set Default Payment Method

Set a payment method as default.

**Endpoint:** `PATCH /api/billing/payment-methods/:id/default`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Payment Method ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "isDefault": true,
  "updatedAt": "string"
}
```

---

## General Information

### Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer {access_token}
```

### Base URL

The base URL for all API endpoints is:
```
https://api.example.com/api
```

Or use the environment variable:
```
VITE_API_BASE_URL
```

### Response Format

All successful responses return JSON with the following structure:
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Validation error or bad request
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., email already exists)
- **500 Internal Server Error**: Server error

### Error Response Format

Error responses follow this structure:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Pagination

Paginated endpoints return pagination metadata:

```json
{
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

### Date Format

All dates are returned in ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ssZ
```

### Rate Limiting

API requests are rate-limited. Check response headers:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

## Summary of Endpoints

### Authentication (6 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/social/:provider` - Social authentication
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Dashboard (3 endpoints)
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/hero` - Get hero content

### Domains (14 endpoints)
- `GET /api/domains` - List domains
- `GET /api/domains/:id` - Get domain details
- `GET /api/domains/search` - Search domain availability
- `POST /api/domains/register` - Register domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain
- `PUT /api/domains/:id/nameservers` - Manage nameservers
- `PATCH /api/domains/:id/auto-renewal` - Update auto-renewal
- `PUT /api/domains/:id/contact` - Update contact info
- `POST /api/domains/:id/renew` - Renew domain
- `GET /api/domains/:id/dns` - Get DNS records
- `PUT /api/domains/:id/dns` - Update DNS records
- `PATCH /api/domains/:id/privacy` - Update privacy protection
- `PATCH /api/domains/:id/brand-protection` - Update brand protection

### Servers (15 endpoints)
- `GET /api/servers` - List servers
- `GET /api/servers/:id` - Get server details
- `POST /api/servers` - Create server
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server
- `GET /api/servers/:id/metrics` - Get usage metrics
- `GET /api/servers/:id/websites` - Get server websites
- `GET /api/servers/:id/billing` - Get billing info
- `POST /api/servers/:id/renew` - Renew server
- `PUT /api/servers/:id/payment-method` - Update payment method
- `GET /api/servers/:id/backups` - Get backups
- `PUT /api/servers/:id/backups` - Update backup settings
- `GET /api/servers/:id/security` - Get security settings
- `GET /api/servers/:id/panel` - Get panel access
- `GET /api/servers/:id/ssh` - Get SSH access

### Websites (5 endpoints)
- `GET /api/websites` - List websites
- `GET /api/websites/:id` - Get website details
- `POST /api/websites` - Create website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website

### Support Tickets (5 endpoints)
- `GET /api/tickets` - List tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create ticket
- `POST /api/tickets/:id/replies` - Reply to ticket
- `PATCH /api/tickets/:id/close` - Close ticket

### Billing (6 endpoints)
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/invoices/:id` - Get invoice details
- `GET /api/billing/payment-methods` - List payment methods
- `POST /api/billing/payment-methods` - Add payment method
- `DELETE /api/billing/payment-methods/:id` - Delete payment method
- `PATCH /api/billing/payment-methods/:id/default` - Set default payment method

**Total: 54 API endpoints**

---

## Notes

- All timestamps are in UTC
- All monetary values are in the user's preferred currency (default: SAR)
- File uploads (if any) should use `multipart/form-data`
- WebSocket connections may be available for real-time updates (documentation TBD)
- API versioning: Current version is `v1` (implicit in base URL)

---

*Last Updated: 2025-01-27*

