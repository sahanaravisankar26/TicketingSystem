package kafka

import (
	"context"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type Consumer struct {
	consumer *kafka.Consumer
}

func NewConsumer(broker string, groupId string, topic string) (*Consumer, error) {
	consume, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": broker,
		"group.id":          groupId,
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		return nil, err
	}

	err = consume.SubscribeTopics([]string{topic}, nil)
	if err != nil {
		return nil, err
	}

	return &Consumer{consumer: consume}, nil
}

func (consume *Consumer) Start(ctx context.Context, handler func([] byte)) {
	for {
		select {
		case <- ctx.Done():
			return
		default:
			msg, err := consume.consumer.ReadMessage(100 * time.Millisecond)
			if err == nil {
				handler(msg.Value)
			}
		}
	}
}