CREATE TABLE IF NOT EXISTS replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,               -- どの投稿への返信か
  user_id VARCHAR(255) NOT NULL,      -- 返信者のユーザID
  comment TEXT NOT NULL,              -- 返信内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);