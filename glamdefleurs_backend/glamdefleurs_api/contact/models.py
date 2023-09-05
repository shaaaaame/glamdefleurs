from django.db import models

# Create your models here.

class ContactForm(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.TextField(max_length=997)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    preferred_contact_method = models.CharField(max_length=100)
    message = models.TextField()
    date_created = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['date_created']