from rest_framework import permissions, viewsets

from contact.models import ContactForm
from contact.serializers import ContactFormSerializer

class ContactFormViewSet(viewsets.ModelViewSet):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    permission_classes = [permissions.AllowAny]