import axios, { type AxiosInstance } from "axios";

import CourseController from "./controllers/course.controller";
import ModuleController from "./controllers/module.controller";
import LessonController from "./controllers/lesson.controller";
import TopicController from "./controllers/topic.controller";
import QuestionController from "./controllers/question.controller";
import UserController from "./controllers/user.controller";
import TagController from "./controllers/tag.controller";

export default class ApiImpl {
  private axios: AxiosInstance;
  public readonly tagController: TagController;
  public readonly courseController: CourseController;
  public readonly moduleController: ModuleController;
  public readonly lessonController: LessonController;
  public readonly topicController: TopicController;
  public readonly questionController: QuestionController;
  public readonly userController: UserController;

  constructor(private accessToken: string) {
    this.axios = axios.create({
      baseURL: process.env.NEXT_API_BASE_URL,
      headers: {
        Authorization: "Token " + this.accessToken,
      },
    });

    this.tagController = new TagController(this.axios);
    this.courseController = new CourseController(this.axios);
    this.moduleController = new ModuleController(this.axios);
    this.lessonController = new LessonController(this.axios);
    this.topicController = new TopicController(this.axios);
    this.questionController = new QuestionController(this.axios);
    this.userController = new UserController(this.axios);
  }
}
