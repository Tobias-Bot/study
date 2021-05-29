from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from django.views.generic import ListView
from rest_framework.response import Response
from . serializers import RoomSerializer, appNotesSerializer
from . permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from django.db.models import F
from django.db.models import Q

from . models import Room
from . models import appNotes


class RoomUpdateView(generics.UpdateAPIView):
    serializer_class = RoomSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    lookup_field = 'user'
    queryset = Room.objects.all()


class RoomDetailView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )

    def get_queryset(self):
        room_id = self.kwargs['id']
        queryset = Room.objects.filter(user_id=room_id)
        return queryset


class RoomListView(generics.ListAPIView):
    serializer_class = RoomSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        queryset = Room.objects.all()
        return queryset


class SearchRoomList(generics.ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        query = self.request.GET.get('q')
        room_list = Room.objects.filter(title__icontains=query)
        return room_list

class appNotesUpdateView(generics.UpdateAPIView):
    serializer_class = appNotesSerializer
    permission_classes = (IsAuthenticated)
    lookup_field = 'user'
    queryset = appNotes.objects.all()

class appNotesDetailView(generics.ListAPIView):
    serializer_class = appNotesSerializer
    permission_classes = (IsAuthenticated)

    def get_queryset(self):
        room_id = self.kwargs['id']
        queryset = appNotes.objects.filter(user_id=room_id)
        return queryset
