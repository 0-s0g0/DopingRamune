FROM golang:1.20-alpine

WORKDIR /go/src
COPY . .

RUN go mod download

# ローカル開発用なら ENTRYPOINT 指定せず、docker-compose.yml の command で実行する
# ENTRYPOINT ["go", "run", "main.go"]