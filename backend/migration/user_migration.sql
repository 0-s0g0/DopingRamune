CREATE TABLE users (
    id INT AUTO_INCREMENT, 
    user_id TEXT, 
    possession_point INT, 
    assignment_point INT, 
    cheer_point INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (id)
);