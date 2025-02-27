CREATE TABLE posts (
    id INT AUTO_INCREMENT, 
    user_id TEXT, 
    post_id INT, 
    picture TEXT,
     text TEXT,
    assignment_point INT, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (id)
     );