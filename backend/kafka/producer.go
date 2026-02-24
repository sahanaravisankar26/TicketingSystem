package kafka

import (
	"encoding/json"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type Producer struct {
	producer *kafka.Producer
	topic string
}

func NewProducer(broker string, topic string) (*Producer, error) {
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": broker,
	})
	if err != nil {
		return  nil, err
	}

	return &Producer{
		producer: producer,
		topic: topic,
	}, nil
}

func (producer *Producer) Publish(event interface{}) error {
	message, err := json.Marshal(event)
	if err != nil {
		return err
	}

	return producer.producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{
			Topic: &producer.topic,
			Partition: kafka.PartitionAny,
		},
		Value: message,
	}, nil)
}