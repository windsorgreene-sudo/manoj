import type { ContentNode, Difficulty } from "../types";

// EduLearn course model: Course -> Chapter -> Lesson, with optional per-lesson
// quizzes. This mirrors the Prisma schema so a real database can replace this
// module later without changing the rendering layer.

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index of the correct option. */
  correct: number;
  explain?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  /** Short summary for listings and SEO. */
  description: string;
  duration: number; // estimated minutes
  /** Starter code shown in the "Try it yourself" playground. */
  codeExample?: string;
  /** Language for the starter code / playground (piston language id). */
  codeLanguage?: string;
  body: ContentNode[];
  quiz?: QuizQuestion[];
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  /** Longer intro shown on the course overview page. */
  longDescription: string;
  icon: string; // emoji
  color: string; // hex accent for the course
  difficulty: Difficulty;
  category: string;
  tags: string[];
  chapters: Chapter[];
}

export interface LessonRef {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  chapterIndex: number;
  lessonIndex: number;
}
