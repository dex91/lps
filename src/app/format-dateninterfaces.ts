import { QuestionRAW, Question } from "./dateninterfaces";
export class formatDateninterfaces {

  /**
   * Formatiert das Objekt der Frage um, damit es nützlich wird bzw dem entspricht was wir benötigen
   * @param question Das Fragenobject an sich
   * @returns Das hier in Angular genutzte Objekt. (Entscheident ist hier das q_edited, dies kann nicht gesetzt sein!!!!!)
   */
  static formatQuestion(question: QuestionRAW): Question {

    let createdNumber = Number(question.q_created);

    let timestamp = Number(question.q_edited);

    if(timestamp == 0) {
      return {
        ...question,
        q_created: new Date(createdNumber * 1000),
        q_edited: new Date("invalid"),
        q_answered: false
      };

    } else {
      return {
        ...question,
        q_created: new Date(createdNumber * 1000),
        q_edited: new Date(timestamp * 1000),
        q_answered: false
      };
     }



  }
}
