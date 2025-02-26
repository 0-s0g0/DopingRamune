package main

import (
    "database/sql"
    "fmt"
    _ "github.com/go-sql-driver/mysql"
    "log"
)

func main() {
    // DBホスト名は docker-compose の service名 "db" になる
    user := "root"
    pass := "password"
    host := "db" // Docker Compose上のサービス名
    port := "3306"
    dbname := "testdb"

    // DSN設定
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        user, pass, host, port, dbname)

    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Fatal("Failed to open DB:", err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal("Failed to connect to DB:", err)
    }
    fmt.Println("Connected to MySQL (via Docker Compose) successfully!")

    // 以降は先ほどの例と同様にテーブル作成/挿入/SELECTなど行う
}
