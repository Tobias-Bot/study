from rest_framework import generics
from . serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated

from . models import Profile

class ProfileView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        id = self.kwargs['id']
        profile = Profile.objects.filter(id=id)
        return profile