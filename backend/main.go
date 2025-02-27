package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Post struct {
	ID              int       `json:"id"`
	UserID          string    `json:"user_id"`
	PostID          int       `json:"post_id"`
	Picture         string    `json:"picture"`
	Text            string    `json:"text"`
	AssignmentPoint int       `json:"assignment_point"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type User struct {
	ID              int       `json:"id"`
	UserID          string    `json:"user_id"`
	PossessionPoint int       `json:"possession_point"`
	AssignmentPoint int       `json:"assignment_point"`
	CheerPoint      int       `json:"cheer_point"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// connectDB は DSNを直書きして MySQL に接続する
func connectDB() (*sql.DB, error) {
	// DSN例: "ユーザ:パスワード@tcp(ホスト:ポート)/DB名?charset=utf8mb4&parseTime=True&loc=Local"
	// 実際の運用ではソースコードにパスワードをハードコーディングしないよう注意！
	dsn := "root:password@tcp(localhost:3306)/dropingramune?charset=utf8mb4&parseTime=True&loc=Local"
	return sql.Open("mysql", dsn)
}

func main() {
	var err error
	db, err = connectDB()
	if err != nil {
		log.Fatalf("DB接続エラー1: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("DB接続エラー2: %v", err)
	}

	// Gin のルーター作成
	r := gin.Default()


	//ソートエンドポイント

	// 投稿作成 (POST /posts)
	r.POST("/posts", createPost)

	// 投稿一覧 (GET /posts) - created_at の新しい順
	r.GET("/posts", getPosts)

	r.GET("/sort/assignment_point", assignmentSort)
	r.GET("/sort/cheer_point", cheerSort)
	// いいねエンドポイント
	r.POST("/cheer", cheer)

	// サーバー起動
	r.Run(":8080")
}


// createPost は 新しい投稿をDBにINSERTするハンドラ
func createPost(c *gin.Context) {
	var post Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	_, err := db.Exec(
		"INSERT INTO posts (user_id, picture, text) VALUES (?, ?, ?)",
		post.UserID, post.Picture, post.Text, 
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert post"})
		return
	}

	c.Status(http.StatusCreated)
}

// getPosts は 新しい投稿順 (created_at DESC) で投稿一覧を返すハンドラ
func getPosts(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, user_id, picture, text, assignment_point, created_at
		FROM posts
		ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query posts"})
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.Picture, &p.Text, &p.AssignmentPoint, &p.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to scan row"})
			return
		}
		posts = append(posts, p)
	}
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "row iteration error"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// いいね関数
func cheer(c *gin.Context) {
	var request struct {
		UserID      string `json:"user_id"`
		PostUserID  string `json:"post_user_id"`
		ID          int    `json:"id"`
		PointChange int    `json:"point_change"` // 変更するポイント数
	}

	// JSON をパース
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	log.Printf("user_id: %s", request.UserID)
	log.Printf("post_user_id: %s", request.PostUserID)
	log.Printf("id: %d", request.ID)
	log.Printf("point_change: %d", request.PointChange)

	// トランザクション開始
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// `posts` テーブルの `assignment_point` を増加
	_, err = tx.Exec("UPDATE posts SET assignment_point = assignment_point + ? WHERE user_id = ? AND id = ?", request.PointChange, request.PostUserID, request.ID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user_id assignment_point"})
		return
	}

	// `users` テーブルの `possession_point` を減算
	_, err = tx.Exec("UPDATE users SET possession_point = possession_point - ? WHERE user_id = ?", request.PointChange, request.UserID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user_id possession_point"})
		return
	}

	// `users` テーブルの `cheer_point` を増加
	_, err = tx.Exec("UPDATE users SET cheer_point = cheer_point + ? WHERE user_id = ?", request.PointChange, request.UserID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user_id cheer_point"})
		return
	}

	// `users` テーブルの `assignment_point` を増加
	_, err = tx.Exec("UPDATE users SET assignment_point = assignment_point + ? WHERE user_id = ?", request.PointChange, request.PostUserID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post_user_id assignment_point"})
		return
	}

	// コミット
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Points updated successfully"})
}

// ソート関数(投稿についたいいね順)
func assignmentSort(c *gin.Context) {
	//sql ソート
	rows, err := db.Query(`
        SELECT id, user_id, text, assignment_point, created_at, updated_at
        FROM posts
        ORDER BY assignment_point DESC
    `)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query posts"})
		return
	}

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.Text, &p.AssignmentPoint, &p.CreatedAt, &p.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		posts = append(posts, p)
	}
	// rows.Err() で iteration 中のエラーを確認
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Row iteration error"})
		return
	}

	// JSON 形式で応答
	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

// ソート関数(人に送ったいいね数順)
func cheerSort(c *gin.Context) {
	//sql ソート
	rows, err := db.Query(`
    SELECT id, user_id, possession_point, assignment_point, cheer_point, created_at, updated_at
    FROM users
    ORDER BY cheer_point DESC
    `)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query posts"})
		return
	}

	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.UserID, &u.PossessionPoint, &u.AssignmentPoint, &u.CheerPoint, &u.CreatedAt, &u.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		users = append(users, u)
	}
	// rows.Err() で iteration 中のエラーを確認
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Row iteration error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
