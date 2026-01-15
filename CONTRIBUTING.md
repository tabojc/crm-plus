# Guía de Contribución

¡Bienvenido al equipo de desarrollo de CRM Plus! Para mantener un código limpio, ordenado y escalable, seguimos estándares estrictos de Versionado y Commit.

## 🌳 GitFlow (Flujo de Trabajo)
Utilizamos una versión simplificada de GitFlow.

1.  **`main`**: Código en producción. Estable y probado.
2.  **`develop`**: Rama principal de desarrollo. Aquí se integran las nuevas funcionalidades.
3.  **`feature/nombre-de-la-feature`**: Ramas para nuevas características. Se crean desde `develop` y se fusionan de vuelta a `develop`.
4.  **`fix/nombre-del-bug`**: Ramas para corrección de errores.

### Pasos para contribuir:
1.  Crea una rama desde `develop`: `git checkout -b feature/nueva-funcionalidad`
2.  Realiza tus cambios.
3.  Haz commits siguiendo **Conventional Commits** (ver abajo).
4.  Sube tu rama y crea un Pull Request hacia `develop`.

---

## 📝 Conventional Commits
Todos los mensajes de commit deben seguir la estructura estándar para facilitar la generación de changelogs y el entendimiento del historial.

**Estructura:**
```text
<tipo>(<alcance>): <descripción breve>

[cuerpo opcional: explicación más detallada]
```

### Tipos Permitidos (`<tipo>`)
- **feat**: Una nueva funcionalidad (e.g., `feat(contacts): add delete button`).
- **fix**: Corrección de un bug (e.g., `fix(products): fix image loading error`).
- **docs**: Cambios solo en documentación (e.g., `docs: update readme`).
- **style**: Cambios de formato (espacios, comas) que no afectan el código.
- **refactor**: Refactorización de código que no arregla bugs ni añade funcionalidades.
- **perf**: Cambios que mejoran el rendimiento.
- **test**: Añadir o corregir tests.
- **chore**: Tareas de mantenimiento, actualización de dependencias, scripts de build.

### Ejemplos
- `feat(quotes): implement create quote wizard`
- `fix(ui): resolve overlap in mobile menu`
- `docs(readme): add deployment instructions`
- `chore: update dependencies`

---

## 🚀 Estándares de Código
- **Idioma**: El código (variables, funciones) debe estar en **Inglés**. La UI (textos visibles) debe estar traducida (actualmente Español).
- **Componentes**: Usa componentes pequeños y reutilizables.
- **Server Actions**: Prefiere Server Actions sobre API Routes para operaciones de datos.
