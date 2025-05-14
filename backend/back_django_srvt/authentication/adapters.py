from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.http import HttpResponseForbidden

class TecsupSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """Verificar que el usuario pertenece al dominio tecsup.edu.pe"""
        email = sociallogin.account.extra_data.get('email', '')
        if not email.endswith('@tecsup.edu.pe'):
            return HttpResponseForbidden("Solo se permiten usuarios con correo de Tecsup.")
        return super().pre_social_login(request, sociallogin)