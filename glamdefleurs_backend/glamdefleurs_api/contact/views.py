from rest_framework import permissions, viewsets

from contact.models import ContactForm
from contact.serializers import ContactFormSerializer

from django.core.mail import send_mail

# Create your views here.

class ContactFormViewSet(viewsets.ModelViewSet):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    def create(self, request, *args, **kwargs):

        # send email on contact form record create
        
        return super().create(request, *args, **kwargs)