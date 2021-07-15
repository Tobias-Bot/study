import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Just HTTP for now. (We can add other protocols later.)
})

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'study_backend.settings')

application = get_asgi_application()
