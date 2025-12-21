# CodeHeart Database Architecture

## 🏗️ Domain-Driven Database Design

This document outlines the database architecture for CodeHeart, following domain-driven design principles with a focus on security, scalability, and GDPR compliance.

## Overview

```mermaid
graph TB
    subgraph "User Domain"
        U[Users]
        R[Roles]
        P[Permissions]
        C[Consents]
    end

    subgraph "Donation Domain"
        D[Donations]
        T[Transactions]
        PM[Payment Methods]
        DH[Donation History]
    end

    subgraph "Beneficiary Domain"
        B[Beneficiaries]
        CW[Codewords]
        S[Stories]
        N[Needs]
    end

    subgraph "Organization Domain"
        O[Organizations]
        SW[Social Workers]
        PA[Partner Locations]
        V[Verifications]
    end

    U --> D
    D --> B
    B --> CW
    SW --> B
    O --> SW
```

## Core Domain Entities

### 1. User Domain

```mermaid
erDiagram
    USERS {
        uuid id PK
        uuid organization_id FK
        string email UK
        string password_hash
        enum role
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    ROLES {
        uuid id PK
        string name UK
        jsonb permissions
        string description
    }

    USER_ROLES {
        uuid user_id FK
        uuid role_id FK
        timestamptz assigned_at
        uuid assigned_by FK
    }

    CONSENTS {
        uuid id PK
        uuid user_id FK
        string version
        jsonb purposes
        enum method
        uuid witness_id FK
        timestamptz consented_at
        timestamptz withdrawn_at
    }

    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    USERS ||--o{ CONSENTS : gives
```

### 2. Beneficiary Domain

```mermaid
erDiagram
    BENEFICIARIES {
        uuid id PK
        string codeword UK
        enum status
        uuid verified_by FK
        timestamptz verified_at
        jsonb privacy_settings
        timestamptz created_at
        timestamptz updated_at
    }

    BENEFICIARY_STORIES {
        uuid id PK
        uuid beneficiary_id FK
        text story_content
        string language
        boolean is_active
        uuid approved_by FK
        timestamptz approved_at
        integer version
    }

    BENEFICIARY_NEEDS {
        uuid id PK
        uuid beneficiary_id FK
        enum category
        string description
        decimal target_amount
        decimal current_amount
        enum priority
        boolean is_fulfilled
    }

    CODEWORD_HISTORY {
        uuid id PK
        uuid beneficiary_id FK
        string codeword
        timestamptz active_from
        timestamptz active_to
        string change_reason
    }

    BENEFICIARIES ||--o{ BENEFICIARY_STORIES : has
    BENEFICIARIES ||--o{ BENEFICIARY_NEEDS : has
    BENEFICIARIES ||--o{ CODEWORD_HISTORY : tracks
```

### 3. Donation Domain

```mermaid
erDiagram
    DONATIONS {
        uuid id PK
        uuid donor_id FK
        uuid beneficiary_id FK
        decimal amount
        string currency
        enum status
        string payment_intent_id
        jsonb metadata
        timestamptz created_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid donation_id FK
        enum type
        decimal amount
        enum status
        string reference
        jsonb payment_details
        timestamptz processed_at
    }

    DONATIONS ||--o{ TRANSACTIONS : has
```

### 4. Organization Domain

```mermaid
erDiagram
    ORGANIZATIONS {
        uuid id PK
        string name
        string type
        jsonb contact_info
        boolean is_verified
        timestamptz created_at
    }

    SOCIAL_WORKERS {
        uuid id PK
        uuid user_id FK
        uuid organization_id FK
        string license_number
        timestamptz verified_at
        boolean is_active
    }

    PARTNER_LOCATIONS {
        uuid id PK
        uuid organization_id FK
        string name
        jsonb address
        point coordinates
        jsonb business_hours
        array accepted_categories
    }
```

## Security Implementation

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Donor can only see their own donations
CREATE POLICY donor_donations ON donations
  FOR SELECT TO authenticated
  USING (donor_id = auth.uid());

-- Social workers can see assigned beneficiaries
CREATE POLICY social_worker_beneficiaries ON beneficiaries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.user_id = auth.uid()
      AND sw.id = beneficiaries.verified_by
    )
  );

-- Beneficiaries can only see their own data
CREATE POLICY beneficiary_self_access ON beneficiaries
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT beneficiary_id FROM user_beneficiaries
      WHERE user_id = auth.uid()
    )
  );
```

### Audit Logging

```sql
-- Comprehensive audit table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES users(id),
  actor_ip INET,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Partitioned by month for performance
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Automated audit trigger
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name, record_id, action,
    actor_id, changes
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    current_setting('app.current_user_id', true)::uuid,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## GDPR Compliance Features

### Data Anonymization

```sql
-- Anonymize user data for GDPR compliance
CREATE OR REPLACE FUNCTION anonymize_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users SET
    email = 'deleted-' || gen_random_uuid() || '@anonymous.local',
    metadata = jsonb_build_object('anonymized_at', NOW()),
    deleted_at = NOW()
  WHERE id = user_id;

  -- Keep donation records but anonymize
  UPDATE donations SET
    metadata = metadata || jsonb_build_object(
      'donor_anonymized', true,
      'anonymized_at', NOW()
    )
  WHERE donor_id = user_id;
END;
$$ LANGUAGE plpgsql;
```

### Data Retention Policies

```sql
-- Automated data retention
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete audit logs older than 1 year
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';

  -- Anonymize inactive beneficiaries
  UPDATE beneficiaries SET
    codeword = 'INACTIVE-' || id,
    status = 'anonymized'
  WHERE updated_at < NOW() - INTERVAL '2 years'
  AND status = 'inactive';
END;
$$ LANGUAGE plpgsql;
```

## Performance Optimization

### Strategic Indexes

```sql
-- Frequently queried columns
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_beneficiary_id ON donations(beneficiary_id);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_beneficiaries_codeword ON beneficiaries(codeword);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Composite indexes for common queries
CREATE INDEX idx_donations_donor_status ON donations(donor_id, status);
CREATE INDEX idx_beneficiaries_location ON beneficiaries USING GIST(location);

-- Full-text search on stories
CREATE INDEX idx_stories_search ON beneficiary_stories
  USING GIN(to_tsvector('german', story_content));
```

### Database Configuration

```yaml
# Supabase optimal settings
max_connections: 100
shared_buffers: 256MB
effective_cache_size: 1GB
work_mem: 4MB
maintenance_work_mem: 64MB

# Connection pooling
pool_mode: transaction
default_pool_size: 25
max_client_conn: 100
```

## Migration Strategy

1. **Version Control**: All migrations in `supabase/migrations/`
2. **Rollback Plan**: Each migration includes down script
3. **Testing**: Apply to staging before production
4. **Monitoring**: Track migration performance

---

**Document Version**: 1.0  
**Last Updated**: May 2025
