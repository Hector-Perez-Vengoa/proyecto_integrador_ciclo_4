-- Personal Access Tokens table creation
-- This script creates the necessary table for storing personal access tokens

CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    last_used_at DATETIME NULL,
    expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Indexes for performance
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_expires_at (expires_at),
    
    -- Foreign key constraint (assuming auth_user table exists)
    CONSTRAINT fk_pat_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth_user(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint for name per user
    CONSTRAINT uk_user_token_name 
        UNIQUE (user_id, name, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample configuration data if needed
-- This is optional and for demonstration purposes
/*
INSERT INTO personal_access_tokens (name, token, user_id, expires_at, is_active) 
VALUES 
    ('Sample API Token', 'tscp_sample1234567890abcdef1234567890abcdef', 1, DATE_ADD(NOW(), INTERVAL 365 DAY), TRUE),
    ('Test Integration', 'tscp_test1234567890abcdef1234567890abcdef12', 1, DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE)
ON DUPLICATE KEY UPDATE id = id; -- Avoid errors if already exists
*/

-- Verify table creation
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'personal_access_tokens'
ORDER BY ORDINAL_POSITION;