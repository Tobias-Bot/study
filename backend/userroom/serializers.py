from rest_framework import serializers

from . models import Room
from . models import appNotes


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class appNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = appNotes
        fields = '__all__'
