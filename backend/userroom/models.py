from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Room(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=500, default="")
    bio = models.TextField(max_length=3000, blank=True)
    users = models.PositiveIntegerField(default=1)
    colors = models.CharField(max_length=17, default="|#9795EF|#F9C5D1|")

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Room.objects.create(user=instance, username=instance.username)
