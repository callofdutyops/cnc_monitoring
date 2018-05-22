from channels.generic.websocket import AsyncWebsocketConsumer
import json
from kafka import KafkaConsumer


class CNCConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.device_pk = -1
        self.data_group_name = ''
        self.kafka_consumer = KafkaConsumer(
            'test',
            bootstrap_servers='192.168.1.199:9092',
            fetch_max_wait_ms=1,
            fetch_min_bytes=1,
        )

    async def connect(self):
        self.device_pk = int(self.scope['url_route']['kwargs']['pk'])
        self.data_group_name = 'device_{0}'.format(self.device_pk)

        # Join room group
        await self.channel_layer.group_add(
            self.data_group_name,
            self.channel_name
        )

        await self.channel_layer.send(
            "kafka-generate",
            {
                "type": "generate",
                "data_group_name": self.data_group_name,
                "device_pk": self.device_pk
            },
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.data_group_name,
            self.channel_name
        )

    async def generate(self, message):
        self.device_pk = message['device_pk']
        self.data_group_name = message['data_group_name']
        print("Test: ", self.data_group_name)

        for msg in self.kafka_consumer:
            msg_value = msg.value.decode('utf-8')
            await self.channel_layer.group_send(
                self.data_group_name,
                {
                    'type': 'update_webpage',
                    'message': msg_value
                }
            )

    # Receive message from room group
    async def update_webpage(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
