from django.urls import path
from . import views
from . views import RoomUpdateView, RoomDetailView

urlpatterns = [
    path('room_update/<int:id>/', RoomUpdateView.as_view()),
    path('room_detail/<int:id>/', RoomDetailView.as_view()),
]