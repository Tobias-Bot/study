from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Room(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.TextField(max_length=500, default="Имя комнаты")
    bio = models.TextField(max_length=3000, blank=True)
    users = models.PositiveIntegerField(default=1)
    color = models.CharField(max_length=7, default="#111111")
    avatar = models.ImageField(blank=True, upload_to='room_avatars/')

class appNotes(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    data = models.TextField(max_length=300000, blank=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Room.objects.create(user=instance, title="Комната пользователя " + instance.username)
        appNotes.objects.create(user=instance)
