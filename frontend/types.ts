export type LessonType = 'video' | 'architecture' | 'code' | 'folder' | 'quiz';

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  description: string;
  type?: 'default' | 'database' | 'client' | 'server';
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface FolderNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  children?: FolderNode[];
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration?: string;
  content: {
    videoUrl?: string;
    diagram?: DiagramData;
    folderTree?: FolderNode[];
    codeSnippets?: CodeSnippet[];
    text?: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  modules: Module[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
