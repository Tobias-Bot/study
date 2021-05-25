from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Settings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.TextField(max_length=100, default="")
    theme = models.TextField(max_length=7, default="#111111")

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Settings.objects.create(user=instance, username=instance.username)
