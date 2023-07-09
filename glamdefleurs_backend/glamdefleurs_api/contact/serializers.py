from rest_framework import serializers
from contact.models import ContactForm

class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = '__all__'