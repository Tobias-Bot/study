from rest_framework import serializers
from django.contrib.auth.models import User

from . models import Room

class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = '__all__'