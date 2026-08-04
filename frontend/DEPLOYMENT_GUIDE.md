# Deployment Guide for Google Cloud Run

## Why did the deployment fail or take too long?
You cannot deploy these raw `.tsx` and `.ts` files directly to Google Cloud Run as-is. Cloud Run expects a containerized application (a Docker image) running a web server. Furthermore, web browsers cannot natively execute raw TypeScript (`.tsx`) files; they must be bundled and transpiled into standard JavaScript first. The sandbox environment handles this transpilation automatically, but Cloud Run does not.

## Can I deploy this directly?
**No.** You need to build the project first. Here is the exact step-by-step process to deploy this code to Google Cloud Run successfully.

### Step 1: Initialize a Build Environment (Local Machine)
Create a new Vite project on your computer to bundle the React application:
```bash
npm create vite@latest nexus-academy -- --template react-ts
cd nexus-academy
npm install
npm install lucide-react @google/genai
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Move Your Files
Copy all the `.tsx` and `.ts` files from this sandbox into the `src/` folder of your new Vite project. Replace the default `App.tsx` and `main.tsx`.

### Step 3: Create a Dockerfile
Create a file named `Dockerfile` in the root of your project. This tells Cloud Run how to build and serve your app using Nginx:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 4: Deploy to Cloud Run
Run the following command using the Google Cloud CLI. This will automatically build the Docker container and deploy it:
```bash
gcloud run deploy nexus-academy \
  --source . \
  --port 80 \
  --allow-unauthenticated \
  --set-env-vars API_KEY="your_gemini_api_key_here"
```

This process ensures your TypeScript is compiled, your Tailwind CSS is purged and minified, and your app is served by a blazing-fast Nginx web server.
