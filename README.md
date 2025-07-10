# ERP-CRM-based-on-the-Odoo-Framework
ERP/CRM-based on the Odoo Framework

# 📘 Guía de Comandos Básicos para Odoo

Este archivo explica paso a paso cómo ejecutar y administrar un proyecto de Odoo desde la terminal.

---

## ▶️ Iniciar el servidor de Odoo

```bash
python odoo-bin -r TU_USUARIO -w TU_CONTRASEÑA --addons-path=addons -d TU_BASE_DE_DATOS
```

## ¿Qué hace este comando?

'Este comando inicia el servidor de Odoo con los siguientes parámetros:'
*-r TU_USUARIO: Usuario de la base de datos (por ejemplo: postgres)*

*-w TU_CONTRASEÑA: Contraseña del usuario de la base de datos*

*--addons-path=addons: Ruta donde se encuentran los módulos (tanto oficiales como personalizados)*

*-d TU_BASE_DE_DATOS: Nombre de la base de datos a utilizar*

**✅ Usá este comando para iniciar normalmente tu entorno de desarrollo de Odoo.

## 🛠️ Instalar módulos y crear tablas en la base de datos

```bash
python odoo-bin -r TU_USUARIO -w TU_CONTRASEÑA --addons-path=addons -d TU_BASE_DE_DATOS -i base
```

'¿Qué hace este comando?'
*Este comando instala el módulo base (o cualquier otro que especifiques) y genera todas las tablas necesarias dentro de la base de datos.*

'-i base: Fuerza la instalación del módulo base u otro que se indique'

🧠 Es útil cuando creás una base de datos nueva o instalás módulos por primera vez.

## 🔄 Reiniciar Odoo luego de realizar cambios

*Si realizás cambios en el código fuente, simplemente podés reiniciar el servidor con:*
```bash
python odoo-bin -r TU_USUARIO -w TU_CONTRASEÑA --addons-path=addons -d TU_BASE_DE_DATOS
```

*Si hiciste cambios en vistas, templates XML u otros archivos declarativos, es recomendable actualizar el módulo correspondiente con:*
```bash
python odoo-bin -r TU_USUARIO -w TU_CONTRASEÑA --addons-path=addons -d TU_BASE_DE_DATOS -u nombre_del_modulo
```

'-u nombre_del_modulo: Actualiza el módulo y aplica los cambios sin eliminar los datos existentes.'
'🔁 Este comando se usa mucho en desarrollo cuando modificás la estructura de vistas, menús o lógica declarativa.'

## ➕ Instalar un módulo personalizado

*Si agregaste un módulo propio dentro de la carpeta addons/ (por ejemplo, gym_management), debés instalarlo con:*
```bash
python odoo-bin -r TU_USUARIO -w TU_CONTRASEÑA --addons-path=addons -d TU_BASE_DE_DATOS -i gym_management
```

'¿Qué hace?'
**Busca el módulo dentro de la carpeta indicada en --addons-path**

**Crea las tablas, menús, vistas y lógica del módulo**

**Permite que lo puedas empezar a usar desde la interfaz de Odoo**

'🧩 Recordá que el nombre debe coincidir exactamente con el nombre de la carpeta del módulo personalizado.'