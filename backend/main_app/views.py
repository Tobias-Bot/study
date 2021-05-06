from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from django.views.generic import ListView
from rest_framework.response import Response
from . serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from django.db.models import F
from django.db.models import Q

from . models import Profile

class ProfileView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        id = self.kwargs['id']
        profile = Profile.objects.filter(id=id)
        return profile