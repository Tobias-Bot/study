from django.urls import path
from . import views
from . views import RoomUpdateView, RoomDetailView, RoomListView, SearchRoomList

urlpatterns = [
    path('room_update/<int:user>/', RoomUpdateView.as_view()),
    path('room_detail/<int:id>/', RoomDetailView.as_view()),
    path('room_list/', RoomListView.as_view()),
    path('room_search/', SearchRoomList.as_view()),
]