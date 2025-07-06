from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from authentication.models import Perfil, Departamento, Carrera, Curso
from django.db import transaction


class Command(BaseCommand):
    help = 'Crea datos de prueba para el sistema de perfiles'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Limpia los datos existentes antes de crear nuevos',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Limpiando datos existentes...')
            Perfil.objects.all().delete()
            Departamento.objects.all().delete()
            Carrera.objects.all().delete()
            Curso.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        with transaction.atomic():
            # Crear departamentos
            self.stdout.write('Creando departamentos...')
            dept_sistemas = Departamento.objects.get_or_create(
                nombre="Ingeniería de Sistemas",
                defaults={
                    'descripcion': 'Departamento de Ingeniería de Sistemas y Computación',
                    'jefe': 'Dr. Juan Pérez'
                }
            )[0]

            dept_industrial = Departamento.objects.get_or_create(
                nombre="Ingeniería Industrial",
                defaults={
                    'descripcion': 'Departamento de Ingeniería Industrial',
                    'jefe': 'Ing. María García'
                }
            )[0]

            # Crear carreras
            self.stdout.write('Creando carreras...')
            carrera_software = Carrera.objects.get_or_create(
                codigo="ISW001",
                defaults={
                    'nombre': 'Ingeniería de Software',
                    'descripcion': 'Carrera de Ingeniería de Software',
                    'departamento': dept_sistemas
                }
            )[0]

            carrera_redes = Carrera.objects.get_or_create(
                codigo="IRD001",
                defaults={
                    'nombre': 'Ingeniería de Redes y Comunicaciones',
                    'descripcion': 'Carrera de Ingeniería de Redes',
                    'departamento': dept_sistemas
                }
            )[0]

            carrera_industrial = Carrera.objects.get_or_create(
                codigo="IIN001",
                defaults={
                    'nombre': 'Ingeniería Industrial',
                    'descripcion': 'Carrera de Ingeniería Industrial',
                    'departamento': dept_industrial
                }
            )[0]

            # Crear cursos
            self.stdout.write('Creando cursos...')
            cursos_data = [
                ('Programación I', 'Fundamentos de programación', carrera_software),
                ('Base de Datos', 'Diseño y administración de BD', carrera_software),
                ('Redes I', 'Fundamentos de redes', carrera_redes),
                ('Seguridad Informática', 'Seguridad en redes', carrera_redes),
                ('Gestión de Proyectos', 'Administración de proyectos', carrera_industrial),
            ]

            cursos = []
            for nombre, desc, carrera in cursos_data:
                curso = Curso.objects.get_or_create(
                    nombre=nombre,
                    defaults={
                        'descripcion': desc,
                        'carrera': carrera,
                        'duracion': 64
                    }
                )[0]
                cursos.append(curso)

            # Crear usuarios y perfiles de prueba
            self.stdout.write('Creando usuarios y perfiles de prueba...')
            
            usuarios_data = [
                {
                    'username': 'profesor1',
                    'email': 'profesor1@tecsup.edu.pe',
                    'first_name': 'Carlos',
                    'last_name': 'Mendoza',
                    'departamento': dept_sistemas,
                    'carreras': [carrera_software],
                    'cursos': [cursos[0], cursos[1]],
                    'biografia': 'Profesor especializado en desarrollo de software',
                    'telefono': '987654321'
                },
                {
                    'username': 'profesor2',
                    'email': 'profesor2@tecsup.edu.pe',
                    'first_name': 'Ana',
                    'last_name': 'Rodriguez',
                    'departamento': dept_sistemas,
                    'carreras': [carrera_redes],
                    'cursos': [cursos[2], cursos[3]],
                    'biografia': 'Experta en redes y ciberseguridad',
                    'telefono': '987654322'
                },
                {
                    'username': 'profesor3',
                    'email': 'profesor3@tecsup.edu.pe',
                    'first_name': 'Luis',
                    'last_name': 'Torres',
                    'departamento': dept_industrial,
                    'carreras': [carrera_industrial],
                    'cursos': [cursos[4]],
                    'biografia': 'Especialista en gestión industrial',
                    'telefono': '987654323'
                }
            ]

            for user_data in usuarios_data:
                # Crear usuario
                user, created = User.objects.get_or_create(
                    username=user_data['username'],
                    defaults={
                        'email': user_data['email'],
                        'first_name': user_data['first_name'],
                        'last_name': user_data['last_name'],
                        'is_staff': False,
                        'is_active': True
                    }
                )
                
                if created:
                    user.set_password('password123')
                    user.save()

                # Crear perfil
                perfil, created = Perfil.objects.get_or_create(
                    user=user,
                    defaults={
                        'telefono': user_data['telefono'],
                        'biografia': user_data['biografia'],
                        'departamento': user_data['departamento']
                    }
                )

                # Asignar carreras y cursos
                if created:
                    perfil.carreras.set(user_data['carreras'])
                    perfil.cursos.set(user_data['cursos'])

                self.stdout.write(
                    self.style.SUCCESS(f'Perfil creado/actualizado: {perfil}')
                )

            # Crear usuario administrador si no existe
            admin_user, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'email': 'admin@tecsup.edu.pe',
                    'first_name': 'Administrador',
                    'last_name': 'Sistema',
                    'is_staff': True,
                    'is_superuser': True,
                    'is_active': True
                }
            )
            
            if created:
                admin_user.set_password('admin123')
                admin_user.save()
                self.stdout.write(
                    self.style.SUCCESS('Usuario administrador creado')
                )

        self.stdout.write(
            self.style.SUCCESS('Datos de prueba creados exitosamente!')
        )
        
        # Mostrar resumen
        self.stdout.write('\n=== RESUMEN ===')
        self.stdout.write(f'Departamentos: {Departamento.objects.count()}')
        self.stdout.write(f'Carreras: {Carrera.objects.count()}')
        self.stdout.write(f'Cursos: {Curso.objects.count()}')
        self.stdout.write(f'Usuarios: {User.objects.count()}')
        self.stdout.write(f'Perfiles: {Perfil.objects.count()}')
        
        self.stdout.write('\n=== CREDENCIALES DE PRUEBA ===')
        self.stdout.write('Admin: admin / admin123')
        self.stdout.write('Profesor 1: profesor1 / password123')
        self.stdout.write('Profesor 2: profesor2 / password123')
        self.stdout.write('Profesor 3: profesor3 / password123')
