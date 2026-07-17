package main

import (
	waProto "go.mau.fi/whatsmeow/binary/proto"
	"google.golang.org/protobuf/proto"
)

func waMessageText(text string) *waProto.Message {
	return &waProto.Message{Conversation: proto.String(text)}
}
