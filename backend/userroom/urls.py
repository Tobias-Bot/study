from django.urls import path
from . views import RoomUpdateView, RoomDetailView, RoomListView, SearchRoomList, appNotesUpdateView, appNotesDetailView

urlpatterns = [
    path('room_update/<int:user>/', RoomUpdateView.as_view()),
    path('room_detail/<int:id>/', RoomDetailView.as_view()),
    path('room_list/', RoomListView.as_view()),
    path('room_search/', SearchRoomList.as_view()),

    path('app_notes_update/<int:user>/', appNotesUpdateView.as_view()),
    path('app_notes_detail/<int:id>/', appNotesDetailView.as_view()),
]
