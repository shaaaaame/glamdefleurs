from rest_framework import serializers
from contact.models import ContactForm
from glamdefleurs_api.email_service.email_service_v2 import send_email, send_purchase_email

# TODO change this
TO_EMAIL = "glamdefleurs@gmail.com"
SUBJECT = "Glam de Fleurs Contact: "

class ContactFormSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=20, required=False)

    class Meta:
        model = ContactForm
        fields = '__all__'

    def create(self, validated_data):
        if "phone_number" in validated_data.keys():
            phone = validated_data['phone_number']
        else:
            phone = ""


        message = f"""
From: {validated_data['name']}, {validated_data['email']}
Phone number: {phone}
Subject: {validated_data['subject']}
Preferred contact method: {validated_data['preferred_contact_method']}
Message: {validated_data['message']}
        """

        send_email(message, "glamdefleurs@gmail.com", SUBJECT + validated_data['subject'])
        return super().create(validated_data)