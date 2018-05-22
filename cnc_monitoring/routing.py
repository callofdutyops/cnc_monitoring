from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, ChannelNameRouter, URLRouter

import app.consumers
import app.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            app.routing.websocket_urlpatterns
        )
    ),
    "channel": ChannelNameRouter({
        "kafka-generate": app.consumers.CNCConsumer,
    }),
})
