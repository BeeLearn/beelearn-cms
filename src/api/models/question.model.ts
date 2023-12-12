export const ContentTypes = {
  dragdropquestion: "Drag Drop",
  textoptionquestion: "Text Option",
  singlechoicequestion: "Single Choice",
  multichoicequestion: "Multiple Choice",
  reorderchoicequestion: "Reorder Choice",
};

interface Choice {
  id: number;
  name: string;
  is_answer: boolean;
}

interface IQuestion {
  id: number;
  title: string;
  content_type: keyof typeof ContentTypes;
  created_at: string;
  updated_at: string;
}

interface ChoiceQuestion {
  choices: Choice[];
}

interface MultipleChoiceQuestion extends ChoiceQuestion {}
interface SingleChoiceQuestion extends ChoiceQuestion {}
interface ReorderChoiceQuestion extends ChoiceQuestion {}

interface TextOptionQuestion extends IQuestion {
  question: string;
}
interface DragDropQuestion extends IQuestion {
  question: string;
  choices: string;
}

type Question = MultipleChoiceQuestion &
  SingleChoiceQuestion &
  ReorderChoiceQuestion &
  TextOptionQuestion &
  DragDropQuestion;

export default Question;

export const choiceTypeQuestion = [
  "dragdropquestion",
  "multichoicequestion",
  "singlechoicequestion",
  "reorderchoicequestion",
];

export const checkTypeQuestion = [
  "multichoicequestion",
  "singlechoicequestion",
];

export const textTypeQuestion = ["dragdropquestion", "textoptionquestion"];
