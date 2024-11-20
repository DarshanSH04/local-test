CREATE TABLE IF NOT EXISTS green_company (
    id                INTEGER PRIMARY KEY,
    entity_id         INTEGER REFERENCES entity (id), 
    name              TEXT NOT NULL,
    normalized_name   TEXT NOT NULL,
    title             TEXT,
    address           TEXT,
    representative    TEXT,
    capital           BIGINT,
    employee_count    INTEGER,
    description       TEXT,
    established_date  TIMESTAMP,
    features          TEXT,
    summary           TEXT,
    industries        TEXT,
    sales             TEXT,
    source_url        TEXT NOT NULL,    
    
    updated_at        TIMESTAMP NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
