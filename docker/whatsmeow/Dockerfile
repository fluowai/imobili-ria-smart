FROM golang:1.22-alpine AS build
WORKDIR /src
RUN apk add --no-cache git build-base
COPY go.mod ./
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=1 GOOS=linux go build -a -o /out/whatsmeow-svc ./

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata libc6-compat
WORKDIR /app
COPY --from=build /out/whatsmeow-svc /app/whatsmeow-svc
EXPOSE 8080
ENTRYPOINT ["/app/whatsmeow-svc"]
