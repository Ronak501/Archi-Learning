import { Course } from './types';

export const MOCK_COURSE: Course = {
  id: 'c1',
  title: 'Build a WhatsApp AI Chatbot',
  description: 'Learn to build a production-ready AI chatbot using WhatsApp Business API, FastAPI, and Gemini.',
  thumbnail: 'https://picsum.photos/seed/whatsappai/800/400',
  progress: 15,
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Introduction & Setup',
      description: 'Understand the core concepts and set up your development environment.',
      lessons: [
        {
          id: 'l1',
          title: 'What is the WhatsApp Business API?',
          type: 'video',
          duration: '5:30',
          content: {
            videoUrl: 'placeholder',
            text: 'In this lesson, we explore the capabilities of the WhatsApp Business API and why it is a powerful platform for AI integrations.'
          }
        },
        {
          id: 'l2',
          title: 'Project Folder Structure',
          type: 'folder',
          content: {
            text: 'A well-organized project is crucial for maintainability. Here is the structure we will use for our FastAPI backend.',
            folderTree: [
              {
                name: 'whatsapp-ai-bot',
                type: 'folder',
                children: [
                  {
                    name: 'app',
                    type: 'folder',
                    description: 'Main application code',
                    children: [
                      { name: 'api', type: 'folder', description: 'API route handlers (endpoints)' },
                      { name: 'core', type: 'folder', description: 'Configuration and security settings' },
                      { name: 'services', type: 'folder', description: 'Business logic (AI, WhatsApp API calls)' },
                      { name: 'main.py', type: 'file', description: 'FastAPI application entry point' }
                    ]
                  },
                  { name: 'requirements.txt', type: 'file', description: 'Python dependencies' },
                  { name: '.env', type: 'file', description: 'Environment variables (API keys)' }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: System Architecture',
      description: 'Visualize how the different components of our system interact.',
      lessons: [
        {
          id: 'l3',
          title: 'High-Level Architecture',
          type: 'architecture',
          content: {
            text: 'Click on the components below to understand their role in the system.',
            diagram: {
              nodes: [
                { id: 'user', label: 'WhatsApp User', x: 50, y: 250, type: 'client', description: 'The end-user sending messages via the WhatsApp app.' },
                { id: 'wa_api', label: 'WhatsApp Cloud API', x: 300, y: 250, type: 'default', description: 'Meta\'s infrastructure that receives messages and forwards them to our webhook.' },
                { id: 'webhook', label: 'FastAPI Webhook', x: 550, y: 250, type: 'server', description: 'Our backend server that listens for incoming messages from WhatsApp.' },
                { id: 'ai_model', label: 'Gemini AI Model', x: 800, y: 150, type: 'default', description: 'The LLM that processes the user\'s message and generates a smart response.' },
                { id: 'db', label: 'PostgreSQL DB', x: 800, y: 350, type: 'database', description: 'Stores chat history and user context for personalized conversations.' }
              ],
              edges: [
                { id: 'e1', from: 'user', to: 'wa_api', label: 'Sends Message', animated: true },
                { id: 'e2', from: 'wa_api', to: 'webhook', label: 'POST /webhook', animated: true },
                { id: 'e3', from: 'webhook', to: 'ai_model', label: 'Generate Content', animated: true },
                { id: 'e4', from: 'webhook', to: 'db', label: 'Save Context' },
                { id: 'e5', from: 'webhook', to: 'wa_api', label: 'Send Reply', animated: true }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Implementation',
      description: 'Write the code to bring the architecture to life.',
      lessons: [
        {
          id: 'l4',
          title: 'Setting up the Webhook',
          type: 'code',
          content: {
            text: 'Let\'s implement the FastAPI endpoint that WhatsApp will call when a user sends a message.',
            codeSnippets: [
              {
                filename: 'app/api/webhook.py',
                language: 'python',
                explanation: 'This endpoint handles both the initial verification from Meta and incoming messages.',
                code: `from fastapi import APIRouter, Request, Response, status
import os

router = APIRouter()
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

@router.get("/webhook")
async def verify_webhook(request: Request):
    """Verifies the webhook with Meta."""
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode and token:
        if mode == "subscribe" and token == VERIFY_TOKEN:
            return Response(content=challenge, status_code=status.HTTP_200_OK)
    return Response(status_code=status.HTTP_403_FORBIDDEN)

@router.post("/webhook")
async def receive_message(request: Request):
    """Receives incoming WhatsApp messages."""
    body = await request.json()
    # Process message asynchronously here
    print("Received:", body)
    return {"status": "ok"}`
              }
            ]
          }
        }
      ]
    },
    {
      id: 'm4',
      title: 'Module 4: Database Design',
      description: 'Design the PostgreSQL database schema to store users and chat history.',
      lessons: [
        {
          id: 'l5',
          title: 'Entity Relationship Diagram',
          type: 'architecture',
          content: {
            text: 'Explore the tables and relationships required to maintain conversation context.',
            diagram: {
              nodes: [
                { id: 'users', label: 'Users Table', x: 100, y: 200, type: 'database', description: 'Stores user phone numbers, names, and preferences.' },
                { id: 'sessions', label: 'Sessions Table', x: 450, y: 100, type: 'database', description: 'Tracks active conversation sessions for context windowing.' },
                { id: 'messages', label: 'Messages Table', x: 450, y: 300, type: 'database', description: 'Logs all incoming and outgoing messages.' }
              ],
              edges: [
                { id: 'e6', from: 'users', to: 'sessions', label: '1 : N' },
                { id: 'e7', from: 'users', to: 'messages', label: '1 : N' },
                { id: 'e8', from: 'sessions', to: 'messages', label: '1 : N' }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'm5',
      title: 'Module 5: API Flow & Security',
      description: 'Understand how requests are authenticated and processed securely.',
      lessons: [
        {
          id: 'l6',
          title: 'Authentication Sequence',
          type: 'architecture',
          content: {
            text: 'Follow the lifecycle of a secure API request from the client to the database.',
            diagram: {
              nodes: [
                { id: 'client', label: 'Client App', x: 50, y: 200, type: 'client', description: 'The frontend application making the request.' },
                { id: 'gateway', label: 'API Gateway', x: 300, y: 200, type: 'server', description: 'Routes requests and enforces rate limiting.' },
                { id: 'auth', label: 'Auth Service', x: 550, y: 100, type: 'server', description: 'Validates JWT tokens and user permissions.' },
                { id: 'service', label: 'Core Service', x: 550, y: 300, type: 'server', description: 'Executes business logic if authenticated.' },
                { id: 'db2', label: 'Database', x: 800, y: 300, type: 'database', description: 'Retrieves or updates the requested data.' }
              ],
              edges: [
                { id: 'e9', from: 'client', to: 'gateway', label: 'Request + JWT', animated: true },
                { id: 'e10', from: 'gateway', to: 'auth', label: 'Verify Token', animated: true },
                { id: 'e11', from: 'auth', to: 'gateway', label: 'Token Valid' },
                { id: 'e12', from: 'gateway', to: 'service', label: 'Forward Request', animated: true },
                { id: 'e13', from: 'service', to: 'db2', label: 'Query Data' }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'm6',
      title: 'Module 6: Deployment',
      description: 'Deploy the application to production using modern CI/CD practices.',
      lessons: [
        {
          id: 'l7',
          title: 'CI/CD Pipeline',
          type: 'architecture',
          content: {
            text: 'Visualize how code moves from your local machine to a live production environment.',
            diagram: {
              nodes: [
                { id: 'dev', label: 'Developer', x: 50, y: 200, type: 'client', description: 'Pushes code changes to the repository.' },
                { id: 'github', label: 'GitHub Repo', x: 300, y: 200, type: 'default', description: 'Source code management and version control.' },
                { id: 'actions', label: 'GitHub Actions', x: 550, y: 200, type: 'server', description: 'Runs tests, builds Docker images, and triggers deployment.' },
                { id: 'registry', label: 'Container Registry', x: 800, y: 100, type: 'database', description: 'Stores the built Docker images.' },
                { id: 'cloudrun', label: 'Google Cloud Run', x: 800, y: 300, type: 'server', description: 'Serverless environment hosting the live application.' }
              ],
              edges: [
                { id: 'e14', from: 'dev', to: 'github', label: 'git push', animated: true },
                { id: 'e15', from: 'github', to: 'actions', label: 'Trigger Workflow', animated: true },
                { id: 'e16', from: 'actions', to: 'registry', label: 'Push Image', animated: true },
                { id: 'e17', from: 'actions', to: 'cloudrun', label: 'Deploy', animated: true },
                { id: 'e18', from: 'registry', to: 'cloudrun', label: 'Pull Image' }
              ]
            }
          }
        }
      ]
    }
  ]
};