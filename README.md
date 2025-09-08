# 💬 Messenger App (WhatsApp Clone)

Una pequeña aplicación que simula un chat estilo WhatsApp utilizando **Next.js**, **React**, **TailwindCSS** y un **servidor WebSocket** en Node.js.  
Permite enviar mensajes, imágenes y archivos en tiempo real de forma sencilla.

---

## 🚀 Características

- 🔗 **Conexión en tiempo real** con WebSockets.
- 📝 **Mensajes de texto** con hora de envío.
- 📂 **Envío de archivos** (imágenes y documentos).
- 🟢 **Notificaciones de conexión/desconexión** de usuarios.
- 🎨 **Interfaz estilo WhatsApp** con **TailwindCSS**.
- ⚡ Construido con **Next.js** y **React 19**.

---

## 🛠️ Requisitos

- [Node.js](https://nodejs.org/) `>=20.x`
- [Bun](https://bun.sh/) (para ejecutar el servidor WebSocket más rápido)
- npm, yarn o bun para manejar dependencias.

---

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/notmarin/messenger-app.git
   cd messenger-app
   ```
1. **Clonar el repositorio**
   ```bash
   bun install
   # o
   npm install
   ```

---

## ▶️ Ejecución

1. **Iniciar el servidor WebSocket**
   ```bash
   bun run server
   ```
   El servidor WebSocket escuchará en:
   ```arduino
   ws://localhost:5000
   ```
2. **Iniciar la app de Next.js**
   ```bash
   bun run dev
   # o
   npm run dev
   ```
   Luego abre tu navegador en:
   ```arduino
   http://localhost:3000
   ```

---

## 💻 Uso

1. Abre la aplicación en tu navegador.

2. Ingresa tu nombre de usuario.

3. Envía mensajes y archivos:
   - 📤 Texto

   - 🖼️ Imágenes (JPG, PNG, GIF, WEBP)

   - 📎 Archivos (cualquier extensión)

4. Observa en tiempo real los mensajes y usuarios conectados.

---

## 📡 Tecnologías usadas

- Next.js 15

- React 19

- TypeScript

- TailwindCSS 4

- WebSocket (ws)

- Bun para el servidor
