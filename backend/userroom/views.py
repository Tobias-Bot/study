from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from django.views.generic import ListView
from rest_framework.response import Response
from . serializers import RoomSerializer
from . permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from django.db.models import F
from django.db.models import Q

from . models import Room


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
